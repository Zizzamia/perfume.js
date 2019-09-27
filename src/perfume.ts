/*!
 * Perfume.js v3.0.0-rc.2 (http://zizzamia.github.io/perfume)
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
  dataConsumption: boolean;
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
  maxDataConsumption: number;
  warning: boolean;
  // Debugging
  debugging: boolean;
}

export interface IPerfumeOptions {
  // Metrics
  firstContentfulPaint?: boolean;
  firstInputDelay?: boolean;
  firstPaint?: boolean;
  dataConsumption?: boolean;
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
  maxDataConsumption?: number;
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

export interface IObservers {
  [metricName: string]: any;
}

export interface IPerfObservers {
  [metricName: string]: any;
}

export type IPerformanceObserverType =
  | 'longtask'
  | 'measure'
  | 'navigation'
  | 'paint'
  | 'resource'
  | 'first-input';

export declare interface IPerformanceEntry {
  decodedBodySize?: number;
  duration: number;
  entryType: IPerformanceObserverType;
  initiatorType?:
    | 'css'
    | 'fetch'
    | 'img'
    | 'other'
    | 'script'
    | 'xmlhttprequest';
  name: string;
  startTime: number;
}

export type IPerfumeMetrics =
  | 'firstContentfulPaint'
  | 'firstPaint'
  | 'firstInputDelay';

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
    dataConsumption: false,
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
    maxDataConsumption: 20000,
    warning: false,
    debugging: false,
  };
  firstPaintDuration: number = 0;
  firstContentfulPaintDuration: number = 0;
  firstInputDelayDuration: number = 0;
  dataConsumption: number = 0;
  observeFirstPaint?: Promise<number>;
  observeFirstContentfulPaint?: Promise<number>;
  observeFirstInputDelay?: Promise<number>;
  observeDataConsumption?: Promise<number>;
  private browser: BrowserInfo | any;
  private dataConsumptionTimeout: any;
  private isHidden: boolean = false;
  private logMetricWarn = 'Please provide a metric name';
  private queue: any;
  private metrics: IMetricMap = {};
  private observers: IObservers = {};
  private perf: Performance;
  private perfObservers: IPerfObservers = {};

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

    // Checks if use Performance or the EmulatedPerformance instance
    if (Performance.supportedPerformanceObserver()) {
      // Init observe FCP  and creates the Promise to observe metric
      if (this.config.firstPaint || this.config.firstContentfulPaint) {
        this.observeFirstContentfulPaint = new Promise(resolve => {
          this.logDebug('observeFirstContentfulPaint');
          this.observers['firstPaint'] = resolve;
          this.observers['firstContentfulPaint'] = resolve;
          this.initFirstPaint();
        });
      }

      // FID needs to be initialized as soon as Perfume is available,
      // which returns a Promise that can be observed.
      // DataConsumption resolves after FID is triggered
      this.observeFirstInputDelay = new Promise(resolve => {
        this.observers['firstInputDelay'] = resolve;
        this.initFirstInputDelay();
      });

      // Collects KB information related to resources on the page
      if (this.config.dataConsumption) {
        this.observeDataConsumption = new Promise(resolve => {
          this.observers['dataConsumption'] = resolve;
          this.initDataConsumption();
        });
      }
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
      this.logWarn('Recording already started.');
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
      this.logWarn('Recording already stopped.');
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
      this.logWarn(this.logMetricWarn);
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
      this.logWarn('Google Analytics has not been loaded');
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
    this.logWarn(this.logMetricWarn);
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
    entries: IPerformanceEntry[];
    entryName?: string;
    metricLog: string;
    metricName: IPerfumeMetrics;
    valueLog: 'duration' | 'startTime';
  }): void {
    this.logDebug('performanceObserverCb', options);
    options.entries.forEach((performanceEntry: IPerformanceEntry) => {
      this.queue.pushTask(() => {
        if (
          this.config[options.metricName] &&
          (!options.entryName ||
            (options.entryName && performanceEntry.name === options.entryName))
        ) {
          this.logMetric(
            performanceEntry[options.valueLog],
            options.metricLog,
            options.metricName,
          );
        }
      });
      if (
        this.perfObservers.firstContentfulPaint &&
        performanceEntry.name === 'first-contentful-paint'
      ) {
        this.perfObservers.firstContentfulPaint.disconnect();
      }
    });
    if (
      this.perfObservers.firstInputDelay &&
      options.metricName === 'firstInputDelay'
    ) {
      this.perfObservers.firstInputDelay.disconnect();
    }
  }

  private performanceObserverResourceCb(options: {
    entries: IPerformanceEntry[];
  }): void {
    this.logDebug('performanceObserverResourceCb', options);
    options.entries.forEach((performanceEntry: IPerformanceEntry) => {
      if (performanceEntry.decodedBodySize) {
        const decodedBodySize = parseFloat(
          (performanceEntry.decodedBodySize / 1000).toFixed(2),
        );
        this.dataConsumption += decodedBodySize;
      }
    });
  }

  private digestFirstPaintEntries(entries: IPerformanceEntry[]): void {
    this.performanceObserverCb({
      entries,
      entryName: 'first-paint',
      metricLog: 'First Paint',
      metricName: 'firstPaint',
      valueLog: 'startTime',
    });
    this.performanceObserverCb({
      entries,
      entryName: 'first-contentful-paint',
      metricLog: 'First Contentful Paint',
      metricName: 'firstContentfulPaint',
      valueLog: 'startTime',
    });
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  private initFirstPaint(): void {
    this.logDebug('initFirstPaint');
    try {
      this.perfObservers.firstContentfulPaint = this.perf.performanceObserver(
        'paint',
        this.digestFirstPaintEntries.bind(this),
      );
    } catch (e) {
      this.logWarn('initFirstPaint failed');
    }
  }

  private digestFirstInputDelayEntries(entries: IPerformanceEntry[]): void {
    this.performanceObserverCb({
      entries,
      metricLog: 'First Input Delay',
      metricName: 'firstInputDelay',
      valueLog: 'duration',
    });
    this.disconnectDataConsumption();
  }

  private initFirstInputDelay(): void {
    try {
      this.perfObservers.firstInputDelay = this.perf.performanceObserver(
        'first-input',
        this.digestFirstInputDelayEntries.bind(this),
      );
    } catch (e) {
      this.logWarn('initFirstInputDelay failed');
    }
  }

  private digestDataConsumptionEntries(entries: IPerformanceEntry[]): void {
    this.performanceObserverResourceCb({
      entries,
    });
  }

  private disconnectDataConsumption(): void {
    clearTimeout(this.dataConsumptionTimeout);
    if (!this.perfObservers.dataConsumption || !this.dataConsumption) {
      return;
    }
    this.logMetric(this.dataConsumption, 'Data Consumption', 'dataConsumption');
    this.perfObservers.dataConsumption.disconnect();
  }

  private initDataConsumption(): void {
    try {
      this.perfObservers.dataConsumption = this.perf.performanceObserver(
        'resource',
        this.digestDataConsumptionEntries.bind(this),
      );
    } catch (e) {
      this.logWarn('initDataConsumption failed');
    }
    this.dataConsumptionTimeout = setTimeout(() => {
      this.disconnectDataConsumption();
    }, 15000);
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
    if (
      metricName !== 'dataConsumption' &&
      duration2Decimal > this.config.maxMeasureTime
    ) {
      return;
    } else if (
      metricName === 'dataConsumption' &&
      duration2Decimal > this.config.maxDataConsumption
    ) {
      return;
    }

    // Save metrics in Duration property
    if (metricName === 'firstPaint') {
      this.firstPaintDuration = duration2Decimal;
    }
    if (metricName === 'firstContentfulPaint') {
      this.firstContentfulPaintDuration = duration2Decimal;
    }
    if (metricName === 'firstInputDelay') {
      this.firstInputDelayDuration = duration2Decimal;
    }
    this.observers[metricName](duration2Decimal);

    // Logs the metric in the internal console.log
    this.log(logText, duration2Decimal);

    // Sends the metric to an external tracking service
    this.sendTiming(metricName, duration2Decimal);
  }

  /**
   * Ensures console.warn exist and logging is enable for
   * warning messages
   */
  private logWarn(message: string): void {
    if (!this.config.warning || !this.config.logging) {
      return;
    }
    window.console.warn(this.config.logPrefix, message);
  }
}
