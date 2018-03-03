import EmulatedPerformance from "./emulated-performance";
import Performance from "./performance";
import PerformImpl from "./performance-impl";

declare global {
  interface Window {
    ga: any;
  }
}

export default class Perfume {
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
  private perf: any;

  constructor(options: any = {}) {
    this.config = Object.assign({}, this.config, options);

    // Init performance implementation
    this.perf = Performance.supported() ? new Performance() : new EmulatedPerformance();
    this.perf.config = this.config;

    // Init First Contentful Paint
    this.perf.firstContentfulPaint(this.firstContentfulPaintCb.bind(this));
  }

  /**
   * Start performance measurement
   *
   * @param {string} metricName
   */
  public start(metricName: string) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (this.metrics[metricName]) {
      global.console.warn(this.config.logPrefix, "Recording already started.");
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
   */
  public end(metricName: string) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.metrics[metricName]) {
      global.console.warn(this.config.logPrefix, "Recording already stopped.");
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
   *
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
   * @param {object} entry
   */
  private firstContentfulPaintCb(entry: any) {
    if (this.config.firstContentfulPaint) {
      this.logFCP(entry.startTime);
    }
    if (Performance.supported()
        && Performance.supportedLongTask()
        && this.config.timeToInteractive) {
      this.perf.timeToInteractive(entry.startTime, this.timeToInteractiveCb.bind(this));
    }
  }

  /**
   * @param {number} timeToInteractive
   */
  private timeToInteractiveCb(timeToInteractive: number) {
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
   */
  private logFCP(duration: number) {
    this.firstContentfulPaintDuration = duration;
    this.log("First Contentful Paint", this.firstContentfulPaintDuration);
    this.sendTiming("firstContentfulPaint", this.firstContentfulPaintDuration);
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
