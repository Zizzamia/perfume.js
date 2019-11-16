/*!
 * Perfume.js v4.0.0-rc2 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import Performance, {
  IMetricEntry,
  IPerformanceEntry,
  IPerfumeNavigationTiming,
} from './performance';

export interface IAnalyticsTrackerOptions {
  metricName: string;
  data?: any;
  duration?: number;
}

export interface IPerfumeConfig {
  // Metrics
  firstContentfulPaint: boolean;
  firstInputDelay: boolean;
  firstPaint: boolean;
  dataConsumption: boolean;
  largestContentfulPaint: boolean;
  navigationTiming: boolean;
  // Analytics
  analyticsTracker: (options: IAnalyticsTrackerOptions) => void;
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
  largestContentfulPaint?: boolean;
  navigationTiming?: boolean;
  // Analytics
  analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
  // Logging
  logPrefix?: string;
  logging?: boolean;
  maxMeasureTime?: number;
  maxDataConsumption?: number;
  warning?: boolean;
  // Debugging
  debugging?: boolean;
}

export interface ILogOptions {
  metricName: string;
  duration?: number;
  data?: any;
  suffix?: string;
}

export interface IMetricMap {
  [metricName: string]: IMetricEntry;
}

export interface IPerfObservers {
  [metricName: string]: any;
}

export interface ISendTimingOptions {
  metricName: string;
  data?: any;
  duration?: number;
}

export type IPerfumeMetrics =
  | 'firstContentfulPaint'
  | 'firstPaint'
  | 'firstInputDelay';

export default class Perfume {
  config: IPerfumeConfig = {
    // Metrics
    firstContentfulPaint: false,
    firstPaint: false,
    firstInputDelay: false,
    dataConsumption: false,
    largestContentfulPaint: false,
    navigationTiming: false,
    // Analytics
    analyticsTracker: options => {},
    // Logging
    logPrefix: 'Perfume.js:',
    logging: true,
    maxMeasureTime: 15000,
    maxDataConsumption: 20000,
    warning: false,
    debugging: false,
  };
  private dataConsumption: number = 0;
  private dataConsumptionTimeout: any;
  private isHidden: boolean = false;
  private largestContentfulPaintDuration: number = 0;
  private logMetricWarn = 'Please provide a metric name';
  private logPrefixRecording = 'Recording already';
  private metrics: IMetricMap = {};
  private perf: Performance;
  private perfObservers: IPerfObservers = {};

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    this.config = Object.assign({}, this.config, options) as IPerfumeConfig;
    this.perf = new Performance();

    // Exit from Perfume when basic Web Performance APIs aren't supported
    if (!Performance.supported()) {
      return;
    }

    // Checks if use Performance or the EmulatedPerformance instance
    if (Performance.supportedPerformanceObserver()) {
      this.initPerformanceObserver();
    }

    // Init visibilitychange listener
    this.onVisibilityChange();

    // Log Navigation Timing
    if (this.config.navigationTiming) {
      this.logNavigationTiming();
    }
  }

  get navigationTiming(): IPerfumeNavigationTiming {
    if (!this.config.navigationTiming) {
      return {};
    }
    return this.perf.navigationTiming;
  }

  /**
   * Start performance measurement
   */
  start(metricName: string): void {
    if (!this.checkMetricName(metricName) || !Performance.supported()) {
      return;
    }
    if (this.metrics[metricName]) {
      this.logWarn(`${this.logPrefixRecording} started.`);
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
    if (!this.checkMetricName(metricName) || !Performance.supported()) {
      return;
    }
    const metric = this.metrics[metricName];
    if (!metric) {
      this.logWarn(`${this.logPrefixRecording} stopped.`);
      return;
    }
    // End Performance Mark
    metric.end = this.perf.now();
    this.perf.mark(metricName, 'end');
    // Get duration and change it to a two decimal value
    const duration = this.perf.measure(metricName);
    const duration2Decimal = parseFloat(duration.toFixed(2));
    delete this.metrics[metricName];
    this.pushTask(() => {
      // Log to console, delete metric and send to analytics tracker
      this.log({ metricName, duration: duration2Decimal });
      this.sendTiming({ metricName, duration: duration2Decimal });
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
   * Coloring Debugging Text in Browser Console
   */
  logDebug(methodName: string, debugValue: any = ''): void {
    if (!this.config.debugging) {
      return;
    }
    window.console.log(
      `${this.config.logPrefix} debugging ${methodName}:`,
      debugValue,
    );
  }

  private initPerformanceObserver(): void {
    if (this.config.firstPaint || this.config.firstContentfulPaint) {
      this.initFirstPaint();
    }
    // FID needs to be initialized as soon as Perfume is available
    // DataConsumption resolves after FID is triggered
    this.initFirstInputDelay();
    this.initLargestContentfulPaint();
    // Collects KB information related to resources on the page
    if (this.config.dataConsumption) {
      this.initDataConsumption();
    }
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
    this.logDebug('PerformanceEntry', options);
    options.entries.forEach((performanceEntry: IPerformanceEntry) => {
      this.pushTask(() => {
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
    this.logDebug('PerformanceEntry:resource', options);
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
    try {
      this.perfObservers.firstContentfulPaint = this.perf.performanceObserver(
        'paint',
        this.digestFirstPaintEntries.bind(this),
      );
    } catch (e) {
      this.logWarn('FP:failed');
    }
  }

  private digestFirstInputDelayEntries(entries: IPerformanceEntry[]): void {
    this.performanceObserverCb({
      entries,
      metricLog: 'First Input Delay',
      metricName: 'firstInputDelay',
      valueLog: 'duration',
    });
    if (
      this.config.largestContentfulPaint &&
      this.largestContentfulPaintDuration
    ) {
      this.logMetric(
        this.largestContentfulPaintDuration,
        'Largest Contentful Paint',
        'largestContentfulPaint',
      );
    }
    this.disconnectDataConsumption();
  }

  /**
   * Update `lcp` to the latest value, using `renderTime` if it's available,
   * otherwise using `loadTime`. (Note: `renderTime` may not be available if
   * the element is an image and it's loaded cross-origin without the
   * `Timing-Allow-Origin` header.)
   */
  private digestLargestContentfulPaint(entries: IPerformanceEntry[]): void {
    this.logDebug('PerformanceEntry:LCP', entries);
    const lastPerformanceEntry = entries[entries.length - 1];
    this.largestContentfulPaintDuration =
      lastPerformanceEntry.renderTime || lastPerformanceEntry.loadTime;
  }

  private initFirstInputDelay(): void {
    try {
      this.perfObservers.firstInputDelay = this.perf.performanceObserver(
        'first-input',
        this.digestFirstInputDelayEntries.bind(this),
      );
    } catch (e) {
      this.logWarn('FID:failed');
    }
  }

  private initLargestContentfulPaint(): void {
    try {
      this.perfObservers.largestContentfulPaint = this.perf.performanceObserver(
        'largest-contentful-paint',
        this.digestLargestContentfulPaint.bind(this),
      );
    } catch (e) {
      this.logWarn('LCP:failed');
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
    this.logMetric(
      this.dataConsumption,
      'Data Consumption',
      'dataConsumption',
      'Kb',
    );
    this.perfObservers.dataConsumption.disconnect();
  }

  private initDataConsumption(): void {
    try {
      this.perfObservers.dataConsumption = this.perf.performanceObserver(
        'resource',
        this.digestDataConsumptionEntries.bind(this),
      );
    } catch (e) {
      this.logWarn('DataConsumption:failed');
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
   * Coloring Text in Browser Console
   */
  private log(options: ILogOptions): void {
    const { metricName, data, duration, suffix } = { suffix: 'ms', ...options };
    // Don't log when page is hidden or has disabled logging
    if (this.isHidden || !this.config.logging) {
      return;
    }
    if (!metricName) {
      this.logWarn(this.logMetricWarn);
      return;
    }
    const style = 'color: #ff6d00;font-size:11px;';
    let text = `%c ${this.config.logPrefix} ${metricName} `;
    if (duration) {
      const durationMs = duration.toFixed(2);
      text += `${durationMs} ${suffix}`;
      window.console.log(text, style);
    } else if (data) {
      window.console.log(text, style, data);
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
    suffix: string = 'ms',
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
    // Logs the metric in the internal console.log
    this.log({ metricName: logText, duration: duration2Decimal, suffix });

    // Sends the metric to an external tracking service
    this.sendTiming({ metricName, duration: duration2Decimal });
  }

  private logNavigationTiming() {
    const metricName = 'navigationTiming';
    // Logs the metric in the internal console.log
    this.log({ metricName, data: this.navigationTiming, suffix: '' });
    // Sends the metric to an external tracking service
    this.sendTiming({ metricName, data: this.navigationTiming });
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

  /**
   * PushTask to requestIdleCallback
   */
  private pushTask(cb: any): void {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(cb, { timeout: 3000 });
    } else {
      cb();
    }
  }

  /**
   * Sends the User timing measure to analyticsTracker
   */
  private sendTiming(options: ISendTimingOptions): void {
    const { metricName, data, duration } = options;
    // Doesn't send timing when page is hidden
    if (this.isHidden) {
      return;
    }
    // Send metric to custom Analytics service
    this.config.analyticsTracker({ metricName, data, duration });
  }
}
