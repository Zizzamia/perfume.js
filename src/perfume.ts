/*!
 * Perfume.js v0.6.4 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import EmulatedPerformance from "./emulated-performance";
import Performance from "./performance";

export interface PerfumeConfig {
  firstContentfulPaint: boolean;
  firstPaint: boolean;
  googleAnalytics: {
    enable: boolean;
    timingVar: string;
  };
  logPrefix: string;
  logging: boolean;
  timeToInteractive: boolean;
  timeToInteractiveCb?: any;
}

export interface Metrics {
  [key: string]: {
    start: number;
    end: number;
  };
}

declare global {
  interface Window {
    ga: any;
  }
}

export default class Perfume {
  public config: PerfumeConfig = {
    firstContentfulPaint: false,
    firstPaint: false,
    googleAnalytics: {
      enable: false,
      timingVar: "name",
    },
    logPrefix: "⚡️ Perfume.js:",
    logging: true,
    timeToInteractive: false,
  };
  public firstPaintDuration: number = 0;
  public firstContentfulPaintDuration: number = 0;
  public timeToInteractiveDuration: number = 0;
  private metrics: Metrics = {};
  private perf: Performance | EmulatedPerformance;
  private perfEmulated: EmulatedPerformance;
  private readonly timeToInteractivePromise: Promise<number>;

  /**
   * @constructor
   * @param options
   */
  constructor(options: any = {}) {
    this.config = Object.assign({}, this.config, options) as PerfumeConfig;
    // Init performance implementation
    this.perf = Performance.supported() ? new Performance() : new EmulatedPerformance();
    this.perf.config = this.config;
    this.timeToInteractivePromise = new Promise((resolve, reject) => {
      // Init First Contentful Paint
      if (Performance.supportedPerformanceObserver()) {
        this.perf.firstContentfulPaint((entries: any[]) => {
          this.firstContentfulPaintCb(entries, resolve, reject);
        });
      } else {
        this.perfEmulated = new EmulatedPerformance();
        this.perfEmulated.firstContentfulPaint((entries: any[]) => {
          this.firstContentfulPaintCb(entries, resolve, reject);
        });
      }
    });
  }

  /**
   * @return {Promise<number>}
   */
  public observeTimeToInteractive(): Promise<number> {
    return this.timeToInteractivePromise;
  }

  /**
   * Start performance measurement
   *
   * @param {string} metricName
   */
  public start(metricName: string): void {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (this.metrics[metricName]) {
      window.console.warn(this.config.logPrefix, "Recording already started.");
      return;
    }
    this.metrics[metricName] = {
      end: 0,
      start: this.perf.now(),
    };
    this.perf.mark(metricName, "start");
  }

  /**
   * End performance measurement
   *
   * @param {string} metricName
   * @return {void|number}
   */
  public end(metricName: string): void | number {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.metrics[metricName]) {
      window.console.warn(this.config.logPrefix, "Recording already stopped.");
      return;
    }
    this.metrics[metricName].end = this.perf.now();
    this.perf.mark(metricName, "end");
    const duration = this.perf.measure(metricName, this.metrics);
    if (this.config.logging) {
      this.log(metricName, duration);
    }
    delete this.metrics[metricName];
    this.sendTiming(metricName, duration);
    return duration;
  }

  /**
   * End performance measurement after first paint from the beging of it
   *
   * @param {string} metricName
   * @return {Promise<number>}
   */
  public endPaint(metricName: string): Promise<void|number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const duration = this.end(metricName);
        resolve(duration);
      });
    });
  }

  /**
   * Coloring Text in Browser Console
   *
   * @param {string} metricName
   * @param {number} duration
   */
  public log(metricName: string, duration: number): void {
    if (!metricName) {
      window.console.warn(this.config.logPrefix, "Please provide a metric name");
      return;
    }
    const durationMs = duration.toFixed(2);
    const style = "color: #ff6d00;font-size:12px;";
    const text = `%c ${this.config.logPrefix} ${metricName} ${durationMs} ms`;
    window.console.log(text, style);
  }

  /**
   * @param {string} metricName
   * @return {boolean}
   */
  private checkMetricName(metricName: string): boolean {
    if (metricName) {
      return true;
    }
    window.console.warn(this.config.logPrefix, "Please provide a metric name");
    return false;
  }

  /**
   * @param {Array<PerformancePaintTiming>} entries
   * @param {(value: any) => void} resolve
   * @param {(error: any) => void} reject
   */
  private firstContentfulPaintCb(entries: any[], resolve: (value: any) => void, reject: (error: any) => void): void {
    let firstContentfulPaintDuration;
    entries.forEach((performancePaintTiming: any) => {
      if (this.config.firstPaint
          && performancePaintTiming.name === "first-paint") {
        this.logFCP(performancePaintTiming.startTime, "First Paint", "firstPaint");
      }
      if (this.config.firstContentfulPaint
          && performancePaintTiming.name === "first-contentful-paint") {
        this.logFCP(performancePaintTiming.startTime, "First Contentful Paint", "firstContentfulPaint");
      }
      if (performancePaintTiming.name === "first-contentful-paint") {
        firstContentfulPaintDuration = performancePaintTiming.startTime;
      }
    });
    if (Performance.supported()
        && Performance.supportedPerformanceObserver()
        && Performance.supportedLongTask()
        && this.config.timeToInteractive
        && firstContentfulPaintDuration) {
      (this.perf as Performance).timeToInteractive(firstContentfulPaintDuration).then((time: number) => {
        resolve(time);
        this.timeToInteractiveCb(time);
      }).catch(reject);
    }
  }

  /**
   * @param {number} timeToInteractive
   */
  private timeToInteractiveCb(timeToInteractive: number): void {
    this.timeToInteractiveDuration = timeToInteractive;
    if (this.timeToInteractiveDuration) {
      this.log("Time to interactive", this.timeToInteractiveDuration);
    }
    if (this.config.timeToInteractiveCb) {
      this.config.timeToInteractiveCb(this.timeToInteractiveDuration);
    }
    this.sendTiming("timeToInteractive", this.timeToInteractiveDuration);
  }

  /**
   * @param {number} duration
   * @param {string} logText
   * @param {string} metricName
   */
  private logFCP(duration: number, logText: string, metricName: string): void {
    if (metricName === "firstPaint") {
      this.firstPaintDuration = duration;
    }
    if (metricName === "firstContentfulPaint") {
      this.firstContentfulPaintDuration = duration;
    }
    this.log(logText, duration);
    this.sendTiming(metricName, duration);
  }

  /**
   * Sends the User timing measure to Google Analytics.
   * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
   * timingCategory: metricName
   * timingVar: googleAnalytics.timingVar
   * timingValue: The value of duration rounded to the nearest integer
   * @param {string} metricName
   * @param {number} duration
   */
  private sendTiming(metricName: string, duration: number): void {
    if (!this.config.googleAnalytics.enable) {
      return;
    }
    if (!window.ga) {
      window.console.warn(this.config.logPrefix, "Google Analytics has not been loaded");
      return;
    }
    const durationInteger = Math.round(duration);
    window.ga("send", "timing", metricName, this.config.googleAnalytics.timingVar, durationInteger);
  }
}
