/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @private
 * @return {number} The current date timestamp
 */
export const now = () => {
  return +new Date();
};

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    cancelIdleCallback: any;
    requestIdleCallback: any;
    safari: any;
  }
}

const supportsRequestIdleCallback_ =
  typeof window.requestIdleCallback === 'function';

/**
 * A minimal shim of the native IdleDeadline class.
 */
class IdleDealine {
  initTime_: any;
  /** @param {number} initTime */
  constructor(initTime: any) {
    this.initTime_ = initTime;
  }
  /** @return {boolean} */
  get didTimeout() {
    return false;
  }
  /** @return {number} */
  timeRemaining() {
    return Math.max(0, 50 - (now() - this.initTime_));
  }
}

/**
 * A minimal shim for the requestIdleCallback function. This accepts a
 * callback function and runs it at the next idle period, passing in an
 * object with a `timeRemaining()` method.
 * @private
 * @param {!Function} callback
 * @return {number}
 */
const requestIdleCallbackShim = (callback: any) => {
  const deadline = new IdleDealine(now());
  return setTimeout(() => callback(deadline), 0);
};

/**
 * A minimal shim for the  cancelIdleCallback function. This accepts a
 * handle identifying the idle callback to cancel.
 * @private
 * @param {number|null} handle
 */
const cancelIdleCallbackShim = (handle: any) => {
  clearTimeout(handle);
};

/**
 * The native `requestIdleCallback()` function or `cancelIdleCallbackShim()`
 * .if the browser doesn't support it.
 * @param {!Function} callback
 * @return {number}
 */
export const rIC = supportsRequestIdleCallback_
  ? window.requestIdleCallback
  : requestIdleCallbackShim;

/**
 * The native `cancelIdleCallback()` function or `cancelIdleCallbackShim()`
 * if the browser doesn't support it.
 * @param {number} handle
 */
export const cIC = supportsRequestIdleCallback_
  ? window.cancelIdleCallback
  : cancelIdleCallbackShim;

const supportsPromisesNatively: boolean =
  typeof Promise === 'function' &&
  Promise.toString().indexOf('[native code]') > -1;

const supportsMutationObserver: boolean =
  'MutationObserver' in window ||
  'WebKitMutationObserver' in window ||
  'MozMutationObserver' in window;

/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @return {!Function}
 */
const createQueueMicrotaskViaPromises = () => {
  return (microtask: any) => {
    Promise.resolve().then(microtask);
  };
};

/**
 * @return {!Function}
 */
const createQueueMicrotaskViaMutationObserver = () => {
  let i = 0;
  let microtaskQueue: any = [];
  const observer = new MutationObserver(() => {
    microtaskQueue.forEach((microtask: any) => microtask());
    microtaskQueue = [];
  });
  const node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return (microtask: any) => {
    microtaskQueue.push(microtask);

    // Trigger a mutation observer callback, which is a microtask.
    // tslint:disable-next-line:no-increment-decrement
    node.data = String(++i % 2);
  };
};

const discardMicrotasks = () => {
  return (microtask: any) => {};
};

/**
 * Queues a function to be run in the next microtask. If the browser supports
 * Promises, those are used. Otherwise it falls back to MutationObserver.
 * Note: since Promise polyfills are popular but not all support microtasks,
 * we check for native implementation rather than a polyfill.
 * @private
 * @param {!Function} microtask
 */
export const queueMicrotask = supportsPromisesNatively
  ? createQueueMicrotaskViaPromises()
  : supportsMutationObserver
    ? createQueueMicrotaskViaMutationObserver()
    : discardMicrotasks();

const DEFAULT_MIN_TASK_TIME = 0;

const isSafari_ = !!(
  typeof window.safari === 'object' && window.safari.pushNotification
);

/**
 * A class wraps a queue of requestIdleCallback functions for two reasons:
 *   1. So other callers can know whether or not the queue is empty.
 *   2. So we can provide some guarantees that the queued functions will
 *      run in unload-type situations.
 */
export class IdleQueue {
  idleCallbackHandle_: any;
  taskQueue_ = [];
  isProcessing_ = false;
  state_ = null;
  defaultMinTaskTime_: any;
  ensureTasksRun_: any;

  /**
   * Creates the IdleQueue instance and adds lifecycle event listeners to
   * run the queue if the page is hidden (with fallback behavior for Safari).
   * @param {{
   *   ensureTasksRun: boolean,
   *   defaultMinTaskTime: number,
   * }=} param1
   */
  constructor({
    ensureTasksRun = false,
    defaultMinTaskTime = DEFAULT_MIN_TASK_TIME,
  } = {}) {
    this.idleCallbackHandle_ = null;
    this.taskQueue_ = [];
    this.isProcessing_ = false;
    this.state_ = null;
    this.defaultMinTaskTime_ = defaultMinTaskTime;
    this.ensureTasksRun_ = ensureTasksRun;

    // Bind methods
    this.runTasksImmediately = this.runTasksImmediately.bind(this);
    this.runTasks_ = this.runTasks_.bind(this);
    this.onVisibilityChange_ = this.onVisibilityChange_.bind(this);

    if (this.ensureTasksRun_) {
      addEventListener('visibilitychange', this.onVisibilityChange_, true);

      // Safari does not reliably fire the `pagehide` or `visibilitychange`
      // events when closing a tab, so we have to use `beforeunload` with a
      // timeout to check whether the default action was prevented.
      // - https://bugs.webkit.org/show_bug.cgi?id=151610
      // - https://bugs.webkit.org/show_bug.cgi?id=151234
      // NOTE: we only add this to Safari because adding it to Firefox would
      // prevent the page from being eligible for bfcache.
      if (isSafari_) {
        addEventListener('beforeunload', this.runTasksImmediately, true);
      }
    }
  }

  /**
   * @param {...*} args
   */
  pushTask(cb: any) {
    this.addTask_(Array.prototype.push, cb);
  }

  /**
   * @param {...*} args
   */
  unshiftTask(cb: any) {
    this.addTask_(Array.prototype.unshift, cb);
  }

  /**
   * Runs all scheduled tasks synchronously.
   */
  runTasksImmediately() {
    // By not passing a deadline, all tasks will be run sync.
    this.runTasks_();
  }

  /**
   * @return {boolean}
   */
  hasPendingTasks() {
    return this.taskQueue_.length > 0;
  }

  /**
   * Clears all pending tasks for the queue and stops any scheduled tasks
   * from running.
   */
  clearPendingTasks() {
    this.taskQueue_ = [];
    this.cancelScheduledRun_();
  }

  /**
   * Returns the state object for the currently running task. If no task is
   * running, null is returned.
   * @return {?Object}
   */
  getState() {
    return this.state_;
  }

  /**
   * Destroys the instance by unregistering all added event listeners and
   * removing any overridden methods.
   */
  destroy() {
    this.taskQueue_ = [];
    this.cancelScheduledRun_();

    if (this.ensureTasksRun_) {
      removeEventListener('visibilitychange', this.onVisibilityChange_, true);

      // Safari does not reliably fire the `pagehide` or `visibilitychange`
      // events when closing a tab, so we have to use `beforeunload` with a
      // timeout to check whether the default action was prevented.
      // - https://bugs.webkit.org/show_bug.cgi?id=151610
      // - https://bugs.webkit.org/show_bug.cgi?id=151234
      // NOTE: we only add this to Safari because adding it to Firefox would
      // prevent the page from being eligible for bfcache.
      if (isSafari_) {
        removeEventListener('beforeunload', this.runTasksImmediately, true);
      }
    }
  }

  /**
   * @param {!Function} arrayMethod Either the Array.prototype{push|shift}.
   * @param {!Function} task
   * @param {{minTaskTime: number}=} param1
   * @private
   */
  addTask_(
    arrayMethod: any,
    task: any,
    { minTaskTime = this.defaultMinTaskTime_ } = {},
  ) {
    const state = {
      time: now(),
      visibilityState: document.visibilityState,
    };

    arrayMethod.call(this.taskQueue_, { state, task, minTaskTime });

    this.scheduleTasksToRun_();
  }

  /**
   * Schedules the task queue to be processed. If the document is in the
   * hidden state, they queue is scheduled as a microtask so it can be run
   * in cases where a macrotask couldn't (like if the page is unloading). If
   * the document is in the visible state, `requestIdleCallback` is used.
   * @private
   */
  scheduleTasksToRun_() {
    if (this.ensureTasksRun_ && document.visibilityState === 'hidden') {
      queueMicrotask(this.runTasks_);
    } else {
      if (!this.idleCallbackHandle_) {
        this.idleCallbackHandle_ = rIC(this.runTasks_);
      }
    }
  }

  /**
   * Runs as many tasks in the queue as it can before reaching the
   * deadline. If no deadline is passed, it will run all tasks.
   * If an `IdleDeadline` object is passed (as is with `requestIdleCallback`)
   * then the tasks are run until there's no time remaining, at which point
   * we yield to input or other script and wait until the next idle time.
   * @param {IdleDeadline=} deadline
   * @private
   */
  runTasks_(deadline?: any) {
    this.cancelScheduledRun_();

    if (!this.isProcessing_) {
      this.isProcessing_ = true;

      // Process tasks until there's no time left or we need to yield to input.
      while (
        this.hasPendingTasks() &&
        !shouldYield(deadline, (this.taskQueue_[0] as any).minTaskTime)
      ) {
        const { task, state } = (this.taskQueue_ as any).shift();

        this.state_ = state;
        task(state);
        this.state_ = null;
      }

      this.isProcessing_ = false;

      if (this.hasPendingTasks()) {
        // Schedule the rest of the tasks for the next idle time.
        this.scheduleTasksToRun_();
      }
    }
  }

  /**
   * Cancels any scheduled idle callback and removes the handler (if set).
   * @private
   */
  cancelScheduledRun_() {
    cIC(this.idleCallbackHandle_);
    this.idleCallbackHandle_ = null;
  }

  /**
   * A callback for the `visibilitychange` event that runs all pending
   * callbacks immediately if the document's visibility state is hidden.
   * @private
   */
  onVisibilityChange_() {
    if (document.visibilityState === 'hidden') {
      this.runTasksImmediately();
    }
  }
}

/**
 * Returns true if the IdleDealine object exists and the remaining time is
 * less or equal to than the minTaskTime. Otherwise returns false.
 * @param {IdleDeadline|undefined} deadline
 * @param {number} minTaskTime
 * @return {boolean}
 * @private
 */
const shouldYield = (deadline: any, minTaskTime: any) => {
  if (deadline && deadline.timeRemaining() <= minTaskTime) {
    return true;
  }
  return false;
};
