/*!
 * Perfume.js v4.0.0-rc.10 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
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

export interface IMetricEntry {
  start: number;
  end: number;
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

export type IPerformanceObserverType =
  | 'first-input'
  | 'largest-contentful-paint'
  | 'longtask'
  | 'measure'
  | 'navigation'
  | 'paint'
  | 'resource';

export type IPerformanceEntryInitiatorType =
  | 'css'
  | 'fetch'
  | 'img'
  | 'other'
  | 'script'
  | 'xmlhttprequest';

export declare interface IPerformanceEntry {
  decodedBodySize?: number;
  duration: number;
  entryType: IPerformanceObserverType;
  initiatorType?: IPerformanceEntryInitiatorType;
  loadTime: number;
  name: string;
  renderTime: number;
  startTime: number;
}

export interface IPerformancePaintTiming {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

declare const PerformanceObserver: any;

declare interface IPerformanceObserverEntryList {
  getEntries: any;
  getEntriesByName: any;
  getEntriesByType: any;
}

export interface IPerformanceObserver {
  observer: () => void;
  disconnect: () => void;
}

export interface IPerfumeNavigationTiming {
  fetchTime?: number;
  workerTime?: number;
  totalTime?: number;
  downloadTime?: number;
  timeToFirstByte?: number;
  headerSize?: number;
  dnsLookupTime?: number;
}

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
  private c = window.console;
  private d = document;
  private dataConsumption: number = 0;
  private dataConsumptionTimeout: any;
  private isHidden: boolean = false;
  private largestContentfulPaintDuration: number = 0;
  private logMetricWarn = 'Missing metric name';
  private logPrefixRecording = 'Recording already';
  private metrics: IMetricMap = {};
  private navigationTimingCached: IPerfumeNavigationTiming = {};
  private perfObserver: any;
  private perfObservers: IPerfObservers = {};
  private w = window;
  private wp = window.performance;

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    this.config = Object.assign({}, this.config, options) as IPerfumeConfig;

    // Exit from Perfume when basic Web Performance APIs aren't supported
    if (!this.isPerformanceSupported()) {
      return;
    }

    // Checks if use Performance or the EmulatedPerformance instance
    if (this.isPerformanceObserverSupported()) {
      this.initPerformanceObserver();
    }

    // Init visibilitychange listener
    this.onVisibilityChange();

    // Log Navigation Timing
    if (this.config.navigationTiming) {
      this.logNavigationTiming();
    }
  }

  /**
   * Start performance measurement
   */
  start(metricName: string): void {
    if (!this.checkMetricName(metricName) || !this.isPerformanceSupported()) {
      return;
    }
    if (this.metrics[metricName]) {
      this.logWarn(`${this.logPrefixRecording} started.`);
      return;
    }
    this.metrics[metricName] = {
      end: 0,
      start: this.wp.now(),
    };
    // Creates a timestamp in the browser's performance entry buffer
    this.performanceMark(metricName, 'start');
    // Reset hidden value
    this.isHidden = false;
  }

  /**
   * End performance measurement
   */
  end(metricName: string): void | number {
    if (!this.checkMetricName(metricName) || !this.isPerformanceSupported()) {
      return;
    }
    const metric = this.metrics[metricName];
    if (!metric) {
      this.logWarn(`${this.logPrefixRecording} stopped.`);
      return;
    }
    // End Performance Mark
    metric.end = this.wp.now();
    this.performanceMark(metricName, 'end');
    // Get duration and change it to a two decimal value
    const duration = this.performanceMeasure(metricName);
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

  private checkMetricName(metricName: string): boolean {
    if (metricName) {
      return true;
    }
    this.logWarn(this.logMetricWarn);
    return false;
  }

  private didVisibilityChange = () => {
    if (this.d.hidden) {
      this.isHidden = this.d.hidden;
    }
  };

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
      this.perfObservers.dataConsumption = this.performanceObserver(
        'resource',
        (entries: IPerformanceEntry[]) => {
          this.performanceObserverResourceCb({
            entries,
          });
        },
      );
    } catch (e) {
      this.logWarn('DataConsumption:failed');
    }
    this.dataConsumptionTimeout = setTimeout(() => {
      this.disconnectDataConsumption();
    }, 15000);
  }

  private initFirstInputDelay(): void {
    try {
      this.perfObservers.firstInputDelay = this.performanceObserver(
        'first-input',
        this.digestFirstInputDelayEntries.bind(this),
      );
    } catch (e) {
      this.logWarn('FID:failed');
    }
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  private initFirstPaint(): void {
    try {
      this.perfObservers.firstContentfulPaint = this.performanceObserver(
        'paint',
        (entries: IPerformanceEntry[]) => {
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
        },
      );
    } catch (e) {
      this.logWarn('FP:failed');
    }
  }

  private initLargestContentfulPaint(): void {
    try {
      this.perfObservers.largestContentfulPaint = this.performanceObserver(
        'largest-contentful-paint',
        (entries: IPerformanceEntry[]) => {
          this.logDebug('PerformanceEntry:LCP', entries);
          const lastPerformanceEntry = entries[entries.length - 1];
          this.largestContentfulPaintDuration =
            lastPerformanceEntry.renderTime || lastPerformanceEntry.loadTime;
        },
      );
    } catch (e) {
      this.logWarn('LCP:failed');
    }
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

  /**
   * True if the browser supports the Navigation Timing API,
   * User Timing API and the PerformanceObserver Interface.
   * In Safari, the User Timing API (performance.mark()) is not available,
   * so the DevTools timeline will not be annotated with marks.
   * Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
   * Support: developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
   * Support: developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByType
   */
  private isPerformanceSupported(): boolean {
    return (
      this.wp && !!this.wp.getEntriesByType && !!this.wp.now && !!this.wp.mark
    );
  }

  /**
   * For now only Chrome fully support the PerformanceObserver interface
   * and the entryType "paint".
   * Firefox 58: https://bugzilla.mozilla.org/show_bug.cgi?id=1403027
   */
  private isPerformanceObserverSupported(): boolean {
    return (this.w as any).chrome && 'PerformanceObserver' in this.w;
  }

  /**
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made by the User Timing API
   */
  private getDurationByMetric(metricName: string): number {
    const entries = this.wp.getEntriesByName(metricName);
    const entry = entries[entries.length - 1];
    if (entry && entry.entryType === 'measure') {
      return entry.duration;
    }
    return -1;
  }

  /**
   * Navigation Timing API provides performance metrics for HTML documents.
   * w3c.github.io/navigation-timing/
   * developers.google.com/web/fundamentals/performance/navigation-and-resource-timing
   */
  private getNavigationTiming(): IPerfumeNavigationTiming {
    if (!this.config.navigationTiming) {
      return {};
    }
    if (
      !this.isPerformanceSupported() ||
      Object.keys(this.navigationTimingCached).length
    ) {
      return this.navigationTimingCached;
    }
    // There is an open issue to type correctly getEntriesByType
    // github.com/microsoft/TypeScript/issues/33866
    const n = performance.getEntriesByType('navigation')[0] as any;
    // In Safari version 11.2 Navigation Timing isn't supported yet
    if (!n) {
      return this.navigationTimingCached;
    }
    const responseStart = n.responseStart;
    const responseEnd = n.responseEnd;
    // We cache the navigation time for future times
    this.navigationTimingCached = {
      // fetchStart marks when the browser starts to fetch a resource
      // responseEnd is when the last byte of the response arrives
      fetchTime: parseFloat((responseEnd - n.fetchStart).toFixed(2)),
      // Service worker time plus response time
      workerTime: parseFloat(
        (n.workerStart > 0 ? responseEnd - n.workerStart : 0).toFixed(2),
      ),
      // Request plus response time (network only)
      totalTime: parseFloat((responseEnd - n.requestStart).toFixed(2)),
      // Response time only (download)
      downloadTime: parseFloat((responseEnd - responseStart).toFixed(2)),
      // Time to First Byte (TTFB)
      timeToFirstByte: parseFloat((responseStart - n.requestStart).toFixed(2)),
      // HTTP header size
      headerSize: parseFloat((n.transferSize - n.encodedBodySize).toFixed(2)),
      // Measuring DNS lookup time
      dnsLookupTime: parseFloat(
        (n.domainLookupEnd - n.domainLookupStart).toFixed(2),
      ),
    };
    return this.navigationTimingCached;
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
      this.c.log(text, style);
    } else if (data) {
      this.c.log(text, style, data);
    }
  }

  /**
   * Coloring Debugging Text in Browser Console
   */
  private logDebug(methodName: string, debugValue: any = ''): void {
    if (!this.config.debugging) {
      return;
    }
    this.c.log(`${this.config.logPrefix} debugging ${methodName}:`, debugValue);
  }

  private logNavigationTiming() {
    const metricName = 'navigationTiming';
    // Logs the metric in the internal console.log
    this.log({ metricName, data: this.getNavigationTiming(), suffix: '' });
    // Sends the metric to an external tracking service
    this.sendTiming({ metricName, data: this.getNavigationTiming() });
  }

  /**
   * Ensures console.warn exist and logging is enable for
   * warning messages
   */
  private logWarn(message: string): void {
    if (!this.config.warning || !this.config.logging) {
      return;
    }
    this.c.warn(this.config.logPrefix, message);
  }

  /**
   * From visibilitychange listener it saves only when
   * the page gets hidden, because it's important to not
   * use the wrong "hidden" value when send timing or logging.
   */
  private onVisibilityChange() {
    if (typeof this.d.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      this.d.addEventListener('visibilitychange', this.didVisibilityChange);
    }
  }

  private performanceMark(metricName: string, type: string): void {
    const mark = `mark_${metricName}_${type}`;
    this.wp.mark(mark);
  }

  private performanceMeasure(metricName: string): number {
    const startMark = `mark_${metricName}_start`;
    const endMark = `mark_${metricName}_end`;
    this.wp.measure(metricName, startMark, endMark);
    return this.getDurationByMetric(metricName);
  }

  /**
   * PerformanceObserver subscribes to performance events as they happen
   * and respond to them asynchronously.
   */
  private performanceObserver(
    eventType: IPerformanceObserverType,
    cb: (entries: any[]) => void,
  ): IPerformanceObserver {
    this.perfObserver = new PerformanceObserver(
      (entryList: IPerformanceObserverEntryList) => {
        const entries = entryList.getEntries();
        cb(entries);
      },
    );
    // Retrieve buffered events and subscribe to newer events for Paint Timing
    this.perfObserver.observe({ type: eventType, buffered: true });
    return this.perfObserver;
  }

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

  /**
   * PushTask to requestIdleCallback
   */
  private pushTask(cb: any): void {
    if ('requestIdleCallback' in this.w) {
      (this.w as any).requestIdleCallback(cb, { timeout: 3000 });
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
