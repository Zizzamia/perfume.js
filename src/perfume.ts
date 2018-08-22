/*!
 * Perfume.js v0.9.0 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license 
 */
import EmulatedPerformance from './emulated-performance';
import GaQueueItem from './gaQueueItem';
import Performance from './performance';

export interface IPerfumeConfig {
  firstContentfulPaint: boolean;
  firstPaint: boolean;
  timeToInteractive: boolean;
  analyticsLogger: any;
  googleAnalytics: {
    enable: boolean;
    timingVar: string;
  };
  logPrefix: string;
  logging: boolean;
  warning: boolean;
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
    timeToInteractive: false,
    analyticsLogger: undefined,
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
  timeToInteractiveDuration: number = 0;
  gaQueue: GaQueueItem[] = [];
  private isHidden: boolean = false;
  private metrics: IMetrics = {};
  private perf: Performance | EmulatedPerformance;
  private perfEmulated?: EmulatedPerformance;
  private readonly timeToInteractivePromise: Promise<number>;
  private logMetric = 'Please provide a metric name';

  constructor(options: any = {}) {
    this.config = Object.assign({}, this.config, options) as IPerfumeConfig;

    // Init window.load listener
    window.addEventListener &&
      window.addEventListener('load', this.onWindowLoad);

    // Init performance implementation
    this.perf = Performance.supported()
      ? new Performance(this.config)
      : new EmulatedPerformance(this.config);
    this.timeToInteractivePromise = new Promise((resolve, reject) => {
      // Init First Contentful Paint
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
    });
    this.onVisibilityChange();
  }

  observeTimeToInteractive(): Promise<number> {
    return this.timeToInteractivePromise;
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
      this.logWarn(this.config.logPrefix, this.logMetric);
      return;
    }
    const durationMs = duration.toFixed(2);
    const style = 'color: #ff6d00;font-size:12px;';
    const text = `%c ${this.config.logPrefix} ${metricName} ${durationMs} ms`;
    window.console.log(text, style);
  }

  /**
   * Records the User timing measure by sending it to:
   * - any custom analytics logger
   * - Google Analytics if enabled and when/if possible
   */
  sendTiming(metricName: string, duration: number): void {
    // Don't send timing when page is hidden
    if (this.isHidden) {
      return;
    }
    if (this.config.analyticsLogger) {
      this.config.analyticsLogger(metricName, duration);
    }
    if (!this.config.googleAnalytics.enable) {
      return;
    }
    if (this.hasGoogleAnalyticsLoaded()) {
      this.sendTimingToGoogleAnalytics(metricName, duration);
    } else {
      this.logWarn(
        this.config.logPrefix,
        'Google Analytics has not been loaded. Timing sends will be queued until page load and tried again.',
      );
      this.gaQueue.push(new GaQueueItem(metricName, duration));
    }
  }

  onWindowLoad(): void {
    // Once window has loaded, GA should have been by now too
    // If not, it was never added by user
    if (this.hasGoogleAnalyticsLoaded()) {
      this.gaQueue.forEach(i => {
        this.sendTimingToGoogleAnalytics(i.metricName, i.duration);
      });
    } else {
      this.logWarn(
        this.config.logPrefix,
        'Google Analytics has not been loaded but window has. Timing send will not be sent to Google Analytics. ' +
          "Please ensure you're adding the ga.js script to your page.",
      );
    }
  }

  private hasGoogleAnalyticsLoaded(): boolean {
    return window.ga && typeof window.ga === 'function';
  }

  /**
   * Sends a timing to Google Analytics.
   * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
   * timingCategory: metricName
   * timingVar: googleAnalytics.timingVar
   * timingValue: The value of duration rounded to the nearest integer
   * @param metricName value to use for timingCategory in GA.
   * @param duration value of duration to use for timingValue in GA. Will be rounded to nearest integer.
   */
  private sendTimingToGoogleAnalytics(metricName: string, duration: number) {
    window.ga(
      'send',
      'timing',
      metricName,
      this.config.googleAnalytics.timingVar,
      Math.round(duration),
    );
  }

  private checkMetricName(metricName: string): boolean {
    if (metricName) {
      return true;
    }
    this.logWarn(this.config.logPrefix, this.logMetric);
    return false;
  }

  private didVisibilityChange = () => {
    if (document.hidden) {
      this.isHidden = document.hidden;
    }
  };

  private firstContentfulPaintCb(
    entries: any[],
    resolve: (value: any) => void,
    reject: (error: any) => void,
  ): void {
    let firstContentfulPaintDuration;
    entries.forEach((performancePaintTiming: any) => {
      if (
        this.config.firstPaint &&
        performancePaintTiming.name === 'first-paint'
      ) {
        this.logFCP(
          performancePaintTiming.startTime,
          'First Paint',
          'firstPaint',
        );
      }
      if (
        this.config.firstContentfulPaint &&
        performancePaintTiming.name === 'first-contentful-paint'
      ) {
        this.logFCP(
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
          this.timeToInteractiveCb(time);
        })
        .catch(reject);
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

  private timeToInteractiveCb(timeToInteractive: number): void {
    this.timeToInteractiveDuration = timeToInteractive;
    if (this.timeToInteractiveDuration) {
      this.log('Time to interactive', this.timeToInteractiveDuration);
    }
    this.sendTiming('timeToInteractive', this.timeToInteractiveDuration);
  }

  private logFCP(duration: number, logText: string, metricName: string): void {
    if (metricName === 'firstPaint') {
      this.firstPaintDuration = duration;
    }
    if (metricName === 'firstContentfulPaint') {
      this.firstContentfulPaintDuration = duration;
    }
    this.log(logText, duration);
    this.sendTiming(metricName, duration);
  }

  private logWarn(prefix: string, message: string): void {
    if (!this.config.warning || !this.config.logging) {
      return;
    }
    window.console.warn(prefix, message);
  }
}
