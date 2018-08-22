/*!
 * Perfume.js v0.8.1 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import EmulatedPerformance from './emulated-performance';
import Performance from './performance';

export interface IPerfumeConfig {
  firstContentfulPaint: boolean;
  firstPaint: boolean;
  firstInputDelay: boolean;
  timeToInteractive: boolean;
  analyticsLogger?: (metricName: string, duration: number) => void;
  googleAnalytics: IGoogleAnalyticsConfig;
  logPrefix: string;
  logging: boolean;
  warning: boolean;
}

export interface IPerfumeOptions {
  firstContentfulPaint?: boolean;
  firstPaint?: boolean;
  firstInputDelay?: boolean;
  timeToInteractive?: boolean;
  analyticsLogger?: (metricName: string, duration: number) => void;
  googleAnalytics?: IGoogleAnalyticsConfig;
  logPrefix?: string;
  logging?: boolean;
  warning?: boolean;
}

export interface IGoogleAnalyticsConfig {
  enable: boolean;
  timingVar: string;
}

export interface IMetrics {
  [key: string]: {
    start: number;
    end: number;
  };
}

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ga: any;
  }
}

export default class Perfume {
  config: IPerfumeConfig = {
    firstContentfulPaint: false,
    firstPaint: false,
    firstInputDelay: false,
    timeToInteractive: false,
    googleAnalytics: {
      enable: false,
      timingVar: 'name',
    },
    logPrefix: '⚡️ Perfume.js:',
    logging: true,
    warning: false,
  };
  firstPaintDuration: number = 0;
  firstContentfulPaintDuration: number = 0;
  firstInputDelayDuration: number = 0;
  observeFirstInputDelay: Promise<number>;
  observeTimeToInteractive: Promise<number>;
  timeToInteractiveDuration: number = 0;
  private isHidden: boolean = false;
  private metrics: IMetrics = {};
  private perf: Performance | EmulatedPerformance;
  private perfEmulated?: EmulatedPerformance;
  private logMetricWarn = 'Please provide a metric name';

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    this.config = Object.assign({}, this.config, options) as IPerfumeConfig;

    // Init performance implementation based on supported browser APIs
    this.perf = Performance.supported()
      ? new Performance(this.config)
      : new EmulatedPerformance(this.config);

    // Init observe FP / FCP / TTI and creates the Promise to observe metrics
    this.observeTimeToInteractive = new Promise((resolve, reject) => {
      this.initFirstPaintAndTTI(resolve, reject);
    });

    // FID needs to be initialized as soon as Perfume is available, which returns
    // a Promise that can be observed
    this.observeFirstInputDelay = new Promise(resolve => {
      this.initFirstInputDelay(resolve);
    });

    // Init visibilitychange listener
    this.onVisibilityChange();
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
    if (!this.metrics[metricName]) {
      this.logWarn(this.config.logPrefix, 'Recording already stopped.');
      return;
    }
    this.metrics[metricName].end = this.perf.now();
    this.perf.mark(metricName, 'end');
    const duration = this.perf.measure(metricName, this.metrics);
    this.log(metricName, duration);
    delete this.metrics[metricName];
    this.sendTiming(metricName, duration);
    return duration;
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
    const style = 'color: #ff6d00;font-size:12px;';
    const text = `%c ${this.config.logPrefix} ${metricName} ${durationMs} ms`;
    window.console.log(text, style);
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

    // Send metric to custom Analytics service,
    // the default choice is Google Analytics
    if (this.config.analyticsLogger) {
      this.config.analyticsLogger(metricName, duration);
    }

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
      metricName,
      this.config.googleAnalytics.timingVar,
      durationInteger,
    );
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

  private firstContentfulPaintCb(
    entries: any[],
    resolve: (duration: number) => void,
    reject: (err: any) => void,
  ): void {
    let firstContentfulPaintDuration;
    entries.forEach((performancePaintTiming: any) => {
      if (
        this.config.firstPaint &&
        performancePaintTiming.name === 'first-paint'
      ) {
        this.logMetric(
          performancePaintTiming.startTime,
          'First Paint',
          'firstPaint',
        );
      }
      if (
        this.config.firstContentfulPaint &&
        performancePaintTiming.name === 'first-contentful-paint'
      ) {
        this.logMetric(
          performancePaintTiming.startTime,
          'First Contentful Paint',
          'firstContentfulPaint',
        );
      }
      if (performancePaintTiming.name === 'first-contentful-paint') {
        firstContentfulPaintDuration = performancePaintTiming.startTime;
      }
    });
    if (
      Performance.supported() &&
      Performance.supportedPerformanceObserver() &&
      Performance.supportedLongTask() &&
      this.config.timeToInteractive &&
      firstContentfulPaintDuration
    ) {
      (this.perf as Performance)
        .timeToInteractive(firstContentfulPaintDuration)
        .then((time: number) => {
          resolve(time);
          this.logMetric(time, 'Time to Interactive', 'timeToInteractive');
        })
        .catch(reject);
    }
  }

  private initFirstPaintAndTTI(
    resolve: (duration: number) => void,
    reject: (err: any) => void,
  ): void {
    // Checks if use Performance or the EmulatedPerformance instance
    if (Performance.supportedPerformanceObserver()) {
      this.perf.firstContentfulPaint((entries: any[]) => {
        this.firstContentfulPaintCb(entries, resolve, reject);
      });
    } else {
      this.perfEmulated = new EmulatedPerformance(this.config);
      this.perfEmulated.firstContentfulPaint((entries: any[]) => {
        this.firstContentfulPaintCb(entries, resolve, reject);
      });
    }
  }

  private initFirstInputDelay(resolve: (duration: number) => void): void {
    if (Performance.supported() && this.config.firstInputDelay) {
      // perfMetrics is exposed by the FID Polyfill
      perfMetrics.onFirstInputDelay((duration, event) => {
        this.logMetric(duration, 'First Input Delay', 'firstInputDelay');
        resolve(duration);
      });
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
    if (metricName === 'firstPaint') {
      this.firstPaintDuration = duration;
    }
    if (metricName === 'firstContentfulPaint') {
      this.firstContentfulPaintDuration = duration;
    }
    if (metricName === 'firstInputDelaty') {
      this.firstInputDelayDuration = duration;
    }
    if (metricName === 'timeToInteractive') {
      this.timeToInteractiveDuration = duration;
    }

    // Logs the metric in the internal console.log
    this.log(logText, duration);

    // Sends the metric to an external tracking service
    this.sendTiming(metricName, duration);
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
