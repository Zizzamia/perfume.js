/*!
 * Perfume.js v3.0.0-beta.0 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import { BrowserInfo, detect } from './detect-browser';
import { IdleQueue } from './idle-queue';

import Performance from './performance';

export interface IPerfumeConfig {
  // Metrics
  firstContentfulPaint: boolean;
  firstInputDelay: boolean;
  firstPaint: boolean;
  // Analytics
  analyticsTracker?: (
    metricName: string,
    duration: number,
    browser?: BrowserInfo | any,
  ) => void;
  browserTracker?: boolean;
  googleAnalytics: IGoogleAnalyticsConfig;
  // Logging
  logPrefix: string;
  logging: boolean;
  maxMeasureTime: number;
  warning: boolean;
  // Debugging
  debugging: boolean;
}

export interface IPerfumeOptions {
  // Metrics
  firstContentfulPaint?: boolean;
  firstInputDelay?: boolean;
  firstPaint?: boolean;
  // Analytics
  analyticsTracker?: (
    metricName: string,
    duration: number,
    browser?: BrowserInfo | any,
  ) => void;
  browserTracker?: boolean;
  googleAnalytics?: IGoogleAnalyticsConfig;
  // Logging
  logPrefix?: string;
  logging?: boolean;
  maxMeasureTime?: number;
  warning?: boolean;
  // Debugging
  debugging?: boolean;
}

export interface IGoogleAnalyticsConfig {
  enable: boolean;
  timingVar: string;
}

export interface IMetricEntry {
  start: number;
  end: number;
}

export interface IMetricMap {
  [metricName: string]: IMetricEntry;
}

export interface IObserverMap {
  [metricName: string]: any;
}

export type IPerformanceObserverType = 'longtask' | 'measure' | 'navigation' | 'paint' | 'resource' | 'first-input';

export declare interface IPerformanceEntry {
  duration: number;
  entryType: IPerformanceObserverType;
  name: string;
  startTime: number;
}

export type IPerfumeMetrics = 'firstContentfulPaint' | 'firstPaint' | 'firstInputDelay';

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ga: any;
  }
}

export default class Perfume {
  config: IPerfumeConfig = {
    // Metrics
    firstContentfulPaint: false,
    firstPaint: false,
    firstInputDelay: false,
    // Analytics
    googleAnalytics: {
      enable: false,
      timingVar: 'name',
    },
    browserTracker: false,
    // Logging
    logPrefix: 'Perfume.js:',
    logging: true,
    maxMeasureTime: 15000,
    warning: false,
    debugging: false,
  };
  firstPaintDuration: number = 0;
  firstContentfulPaintDuration: number = 0;
  firstInputDelayDuration: number = 0;
  observeFirstContentfulPaint?: Promise<number>;
  observeFirstInputDelay?: Promise<number>;
  private browser: BrowserInfo | any;
  private isHidden: boolean = false;
  private logMetricWarn = 'Please provide a metric name';
  private queue: any;
  private metrics: IMetricMap = {};
  private observers: IObserverMap = {};
  private perf: Performance;

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    this.config = Object.assign({}, this.config, options) as IPerfumeConfig;
    this.perf = new Performance(this.config);

    // Exit from Perfume when basic Web Performance APIs aren't supported
    if (!Performance.supported()) {
      return;
    }

    // In case we want to track Browser version and OS
    if (this.config.browserTracker) {
      this.browser = detect();
    }

    // Init observe FCP  and creates the Promise to observe metric
    if (this.config.firstPaint || this.config.firstContentfulPaint) {
      this.observeFirstContentfulPaint = new Promise(resolve => {
        this.logDebug('observeFirstContentfulPaint');
        this.observers['fcp'] = resolve;
        this.initFirstPaint();
      });
    }

    // FID needs to be initialized as soon as Perfume is available, which returns
    // a Promise that can be observed
    if (this.config.firstInputDelay) {
      this.observeFirstInputDelay = new Promise(resolve => {
        this.observers['fid'] = resolve;
        this.initFirstInputDelay();
      });
    }

    // Init visibilitychange listener
    this.onVisibilityChange();

    // Ensures the queue is run immediately whenever the page
    // is in a state where it might soon be unloaded.
    // https://philipwalton.com/articles/idle-until-urgent/
    this.queue = new IdleQueue({ ensureTasksRun: true });
  }

  /**
   * Start performance measurement
   */
  start(metricName: string): void {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (this.metrics[metricName]) {
      this.logWarn(this.config.logPrefix, 'Recording already started.');
      return;
    }
    this.metrics[metricName] = {
      end: 0,
      start: this.perf.now(),
    };
    // Creates a timestamp in the browser's performance entry buffer
    this.perf.mark(metricName, 'start');
    // Reset hidden value
    this.isHidden = false;
  }

  /**
   * End performance measurement
   */
  end(metricName: string): void | number {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    const metric = this.metrics[metricName];
    if (!metric) {
      this.logWarn(this.config.logPrefix, 'Recording already stopped.');
      return;
    }
    // End Performance Mark
    metric.end = this.perf.now();
    this.perf.mark(metricName, 'end');
    // Get duration and change it to a two decimal value
    const duration = this.perf.measure(metricName, metric);
    const duration2Decimal = parseFloat(duration.toFixed(2));
    delete this.metrics[metricName];
    this.queue.pushTask(() => {
      // Log to console, delete metric and send to analytics tracker
      this.log(metricName, duration2Decimal);
      this.sendTiming(metricName, duration2Decimal);
    });
    return duration2Decimal;
  }

  /**
   * End performance measurement after first paint from the beging of it
   */
  endPaint(metricName: string): Promise<void | number> {
    return new Promise(resolve => {
      setTimeout(() => {
        const duration = this.end(metricName);
        resolve(duration);
      });
    });
  }

  /**
   * Coloring Text in Browser Console
   */
  log(metricName: string, duration: number): void {
    // Don't log when page is hidden or has disabled logging
    if (this.isHidden || !this.config.logging) {
      return;
    }
    if (!metricName) {
      this.logWarn(this.config.logPrefix, this.logMetricWarn);
      return;
    }
    const durationMs = duration.toFixed(2);
    const style = 'color: #ff6d00;font-size:11px;';
    const text = `%c ${this.config.logPrefix} ${metricName} ${durationMs} ms`;
    window.console.log(text, style);
  }

  /**
   * Coloring Debugging Text in Browser Console
   */
  logDebug(methodName: string, debugValue: any = ''): void {
    if (!this.config.debugging) {
      return;
    }
    window.console.log(`Perfume.js debugging ${methodName}:`, debugValue);
  }

  /**
   * Sends the User timing measure to Google Analytics.
   * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
   * timingCategory: metricName
   * timingVar: googleAnalytics.timingVar
   * timingValue: The value of duration rounded to the nearest integer
   */
  sendTiming(metricName: string, duration: number): void {
    // Doesn't send timing when page is hidden
    if (this.isHidden) {
      return;
    }
    // Get Browser from userAgent
    const browser = this.config.browserTracker ? this.browser : undefined;
    const metricNameWithBrowser = this.addBrowserToMetricName(metricName);
    // Send metric to custom Analytics service,
    // the default choice is Google Analytics
    if (this.config.analyticsTracker) {
      this.config.analyticsTracker(metricName, duration, browser);
    }
    // Stop sending timing to GA if not enabled
    if (!this.config.googleAnalytics.enable) {
      return;
    }
    if (!window.ga) {
      this.logWarn(
        this.config.logPrefix,
        'Google Analytics has not been loaded',
      );
      return;
    }
    const durationInteger = Math.round(duration);
    window.ga(
      'send',
      'timing',
      metricNameWithBrowser,
      this.config.googleAnalytics.timingVar,
      durationInteger,
    );
  }

  private addBrowserToMetricName(metricName: string): string {
    if (!this.config.browserTracker) {
      return metricName;
    }
    let metricNameWithBrowser = metricName;
    // Check if Browser Name exist
    if (this.browser.name) {
      const browserName = this.browser.name.replace(/\s/g, '');
      metricNameWithBrowser += `.${browserName}`;
      // Check if Browser OS exist
      if (this.browser.os) {
        const browserOS = this.browser.os.replace(/\s/g, '');
        metricNameWithBrowser += `.${browserOS}`;
      }
    }
    return metricNameWithBrowser;
  }

  private checkMetricName(metricName: string): boolean {
    if (metricName) {
      return true;
    }
    this.logWarn(this.config.logPrefix, this.logMetricWarn);
    return false;
  }

  private didVisibilityChange = () => {
    if (document.hidden) {
      this.isHidden = document.hidden;
    }
  };

  /**
   * Logging Performance Paint Timing
   */
  private performanceObserverCb(options: {
    entries: IPerformanceEntry[],
    entryName?: string,
    metricLog: string,
    metricName: IPerfumeMetrics,
    valueLog: 'duration' | 'startTime'
  }): void {
    this.logDebug('performanceObserverCb', options);
    options.entries.forEach((performanceEntry: IPerformanceEntry) => {
      this.queue.pushTask(() => {
        if (
          this.config[options.metricName] &&
          (!options.entryName || (options.entryName && performanceEntry.name === options.entryName))
        ) {
          this.logMetric(
            performanceEntry[options.valueLog],
            options.metricLog,
            options.metricName,
          );
        }
      });
    });
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  private initFirstPaint(): void {
    this.logDebug('initFirstPaint');
    // Checks if use Performance or the EmulatedPerformance instance
    if (Performance.supportedPerformanceObserver()) {
      this.logDebug('initFirstPaint.supportedPerformanceObserver');
      try {
        this.perf.performanceObserver('paint', (entries: IPerformanceEntry[]) => {
          this.performanceObserverCb({
            entries,
            entryName: 'first-paint',
            metricLog: 'First Paint',
            metricName: 'firstPaint',
            valueLog: 'startTime'
          })
          this.performanceObserverCb({
            entries,
            entryName: 'first-contentful-paint',
            metricLog: 'First Contentful Paint',
            metricName: 'firstContentfulPaint',
            valueLog: 'startTime'
          })
        });
      } catch (e) {
        this.logWarn(this.config.logPrefix, 'initFirstPaint failed');
      }
    }
  }

  private initFirstInputDelay(): void {
    if (Performance.supportedPerformanceObserver() && this.config.firstInputDelay) {
      try {
        this.perf.performanceObserver('first-input', (entries: IPerformanceEntry[]) => {
          this.performanceObserverCb({
            entries,
            metricLog: 'First Input Delay',
            metricName: 'firstInputDelay',
            valueLog: 'duration'
          })
        });
      } catch (e) {
        this.logWarn(this.config.logPrefix, 'initFirstInputDelay failed');
      }
    }
  }

  /**
   * From visibilitychange listener it saves only when
   * the page gets hidden, because it's important to not
   * use the wrong "hidden" value when send timing or logging.
   */
  private onVisibilityChange() {
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      document.addEventListener('visibilitychange', this.didVisibilityChange);
    }
  }

  /**
   * Dispatches the metric duration into internal logs
   * and the external time tracking service.
   */
  private logMetric(
    duration: number,
    logText: string,
    metricName: string,
  ): void {
    const duration2Decimal = parseFloat(duration.toFixed(2));
    // Stop Analytics and Logging for false negative metrics
    if (duration2Decimal > this.config.maxMeasureTime) {
      return;
    }

    // Save metrics in Duration property
    if (metricName === 'firstPaint') {
      this.firstPaintDuration = duration2Decimal;
    }
    if (metricName === 'firstContentfulPaint') {
      this.firstContentfulPaintDuration = duration2Decimal;
      this.observers['fcp'](duration2Decimal);
    }
    if (metricName === 'firstInputDelay') {
      this.firstInputDelayDuration = duration2Decimal;
      this.observers['fid'](duration2Decimal);
    }

    // Logs the metric in the internal console.log
    this.log(logText, duration2Decimal);

    // Sends the metric to an external tracking service
    this.sendTiming(metricName, duration2Decimal);
  }

  /**
   * Ensures console.warn exist and logging is enable for
   * warning messages
   */
  private logWarn(prefix: string, message: string): void {
    if (!this.config.warning || !this.config.logging) {
      return;
    }
    window.console.warn(prefix, message);
  }
}
