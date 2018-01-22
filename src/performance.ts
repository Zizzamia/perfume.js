declare const PerformanceObserver: any;
declare interface PerformanceObserverEntryList {
  getEntries: any;
}

export default class Performance {

  /**
   * True if the browser supports the Navigation Timing API.
   * @type {boolean}
   */
  get supportsPerfNow(): boolean {
    return window.performance && performance.now ? true : false;
  }

  /**
   * True if the browser supports the User Timing API.
   * Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
   * @type {boolean}
   */
  get supportsPerfMark(): boolean {
    return window.performance && performance.mark ? true : false;
  }

  /**
   * True if the browser supports the PerformanceObserver Interface.
   * Support: developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
   * @type {boolean}
   */
  get supportsPerfObserver(): boolean {
    return "PerformanceLongTaskTiming" in window;
  }

  /**
   * This assumes the user has made only one measurement for the given
   * name. Return the first PerformanceEntry objects for the given name.
   * @param {string} metricName
   */
  public getMeasurementForGivenName(metricName: string) {
    return performance.getEntriesByName(metricName)[0];
  }

  /**
   * When performance API available:
   * - Returns a DOMHighResTimeStamp, measured in milliseconds, accurate to five
   *   thousandths of a millisecond (5 microseconds).
   * Otherwise:
   * - Unlike returns Date.now that is limited to one-millisecond resolution.
   * @type {number}
   */
  public performanceNow(): number {
    if (this.supportsPerfMark) {
      return window.performance.now();
    } else {
      return Date.now() / 1000;
    }
  }

  /**
   * @param {string} metricName
   * @param {string} type
   */
  public mark(metricName: string, type: string) {
    if (!this.supportsPerfMark) {
      return;
    }
    const mark = `mark_${metricName}_${type}`;
    window.performance.mark(mark);
  }

  /**
   * @param {string} metricName
   * @param {string} startMark
   * @param {string} endMark
   */
  public measure(metricName: string, startType: string, endType: string) {
    if (!this.supportsPerfMark) {
      return;
    }
    const startMark = `mark_${metricName}_${startType}`;
    const endMark = `mark_${metricName}_${endType}`;
    window.performance.measure(metricName, startMark, endMark);
  }

  /**
   * PerformanceObserver subscribes to performance events as they happen
   * and respond to them asynchronously.
   * entry.name will be either 'first-paint' or 'first-contentful-paint'
   * @param {any} cb
   */
  public initPerformanceObserver(cb: any) {
    const observer = new PerformanceObserver(this.performanceObserverCb.bind(this, cb));
    observer.observe({entryTypes: ["paint"]});
  }

  /**
   * http://msdn.microsoft.com/ff974719
   * developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart
   */
  public getFirstPaint() {
    if (performance) {
      const navTiming = performance.timing;
      if (navTiming && navTiming.navigationStart !== 0) {
        return Date.now() - navTiming.navigationStart;
      }
    }
    return 0;
  }

  /**
   * @param {any} cb
   * @param {PerformanceObserverEntryList} entryList
   */
  private performanceObserverCb(cb: any, entryList: PerformanceObserverEntryList) {
    for (const entry of entryList.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        cb(entry);
      }
    }
  }
}
