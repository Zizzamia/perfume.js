import ttiPolyfill from "tti-polyfill";
import Performance from "./performance";

declare const PerformanceObserver: any;
declare global {
  interface Window {
    ga: any;
  }
}

export default class Perfume extends Performance {
  public config: {
    firstContentfulPaint: boolean,
    googleAnalytics: {
      enable: boolean;
      timingVar: string;
    },
    logPrefix: string,
    logging: boolean,
    timeToInteractive: boolean,
    timeToInteractiveCb?: any,
  } = {
    firstContentfulPaint: false,
    googleAnalytics: {
      enable: false,
      timingVar: "name",
    },
    logPrefix: "⚡️ Perfume.js:",
    logging: true,
    timeToInteractive: false,
  };
  public firstContentfulPaintDuration: number = 0;
  public timeToInteractiveDuration: number = 0;
  private metrics: {
    [key: string]: {
      start: number;
      end: number;
    };
  } = {};
  private ttiPolyfill: any;

  constructor(options: any = {}) {
    super();
    this.ttiPolyfill = ttiPolyfill;
    this.config = Object.assign({}, this.config, options);
    if (!this.supportsPerfNow) {
      global.console.warn(this.config.logPrefix, "Cannot be used in this browser.");
    }
    this.firstContentfulPaint();
  }

  /**
   * Start performance measurement
   * @param {string} metricName
   */
  public start(metricName: string) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.supportsPerfMark) {
      global.console.warn(this.config.logPrefix, `Timeline won't be marked for "${metricName}".`);
    }
    if (this.metrics[metricName]) {
      global.console.warn(this.config.logPrefix, "Recording already started.");
      return;
    }
    this.metrics[metricName] = {
      end: 0,
      start: this.performanceNow(),
    };
    this.mark(metricName, "start");
  }

  /**
   * End performance measurement
   * @param {string} metricName
   */
  public end(metricName: string) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.metrics[metricName]) {
      global.console.warn(this.config.logPrefix, "Recording already stopped.");
      return;
    }
    this.metrics[metricName].end = this.performanceNow();
    this.mark(metricName, "end");
    this.measure(metricName, "start", "end");
    const duration = this.getDurationByMetric(metricName);
    if (this.config.logging) {
      this.log(metricName, duration);
    }
    delete this.metrics[metricName];
    this.sendTiming(metricName, duration);
    return duration;
  }

  /**
   * End performance measurement after first paint from the beging of it
   * @param {string} metricName
   */
  public endPaint(metricName: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const duration = this.end(metricName);
        resolve(duration);
      });
    });
  }

  /**
   * Coloring Text in Browser Console
   * @param {string} metricName
   * @param {number} duration
   */
  public log(metricName: string, duration: number) {
    if (!metricName || !duration) {
      global.console.warn(this.config.logPrefix, "Please provide a metric name and the duration value");
      return;
    }
    const durationMs = duration.toFixed(2);
    const style = "color: #ff6d00;font-size:12px;";
    const text = `%c ${this.config.logPrefix} ${metricName} ${durationMs} ms`;
    global.console.log(text, style);
  }

  /**
   * @param {string} metricName
   */
  private checkMetricName(metricName: string) {
    if (metricName) {
      return true;
    }
    global.console.warn(this.config.logPrefix, "Please provide a metric name");
    return false;
  }

  /**
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made. Use User Timing API results if available, otherwise return
   * performance.now() fallback.
   * @param {string} metricName
   */
  private getDurationByMetric(metricName: string) {
    if (this.supportsPerfMark) {
      const entry = this.getMeasurementForGivenName(metricName);
      if (entry && entry.entryType !== "measure") {
        return entry.duration;
      }
    }
    const duration = this.metrics[metricName].end - this.metrics[metricName].start;
    return duration || -1;
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  private firstContentfulPaint() {
    if (this.supportsPerfObserver) {
      this.initPerformanceObserver(this.observeFirstContentfulPaint(this));
    } else {
      this.timeFirstPaint();
    }
  }

  /**
   * @param {object} entry
   */
  private observeFirstContentfulPaint(entry: any) {
    if (this.config.firstContentfulPaint) {
      this.logFCP(entry.startTime);
    }
    if (this.config.timeToInteractive) {
      this.timeToInteractive(entry.startTime);
    }
  }

  /**
   * Uses setTimeout to retrieve FCP
   */
  private timeFirstPaint() {
    setTimeout(() => {
      this.logFCP(this.getFirstPaint());
    });
  }

  /**
   * @param {number} duration
   */
  private logFCP(duration: number) {
    this.firstContentfulPaintDuration = duration;
    if (this.firstContentfulPaintDuration) {
      this.log("First Contentful Paint", this.firstContentfulPaintDuration);
    }
    this.sendTiming("firstContentfulPaint", this.firstContentfulPaintDuration);
  }

  /**
   * The polyfill exposes a getFirstConsistentlyInteractive() method,
   * which returns a promise that resolves with the TTI value.
   *
   * The getFirstConsistentlyInteractive() method accepts an optional
   * startTime configuration option, allowing you to specify a lower bound
   * for which you know your app cannot be interactive before.
   * By default the polyfill uses DOMContentLoaded as the start time,
   * but it's often more accurate to use something like the moment your hero elements
   * are visible or the point when you know all your event listeners have been added.
   */
  private timeToInteractive(minValue: number) {
    this.ttiPolyfill.getFirstConsistentlyInteractive({ minValue })
    .then(this.timeToInteractiveResolve.bind(this));
  }

  /**
   * @param {number} timeToInteractive
   */
  private timeToInteractiveResolve(timeToInteractive: number) {
    this.timeToInteractiveDuration = timeToInteractive;
    if (this.timeToInteractiveDuration) {
      this.log("Time to interactive", this.timeToInteractiveDuration);
    }
    if (this.config.timeToInteractiveCb) {
      this.config.timeToInteractiveCb(timeToInteractive);
    }
    this.sendTiming("timeToInteractive", this.timeToInteractiveDuration);
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
  private sendTiming(metricName: string, duration: number) {
    if (!this.config.googleAnalytics.enable) {
      return;
    }
    if (!window.ga) {
      global.console.warn(this.config.logPrefix, "Google Analytics has not been loaded");
      return;
    }
    const durationInteger = Math.round(duration);
    window.ga("send", "timing", metricName, this.config.googleAnalytics.timingVar, durationInteger);
  }
}
