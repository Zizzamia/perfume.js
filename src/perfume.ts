declare global {
  interface Window { ga: any; }
}

export default class Perfume {
  public firstPaintDuration: number;
  public googleAnalytics: {
    timingVar: string;
    enable: boolean;
  };
  private metrics: {
    [key: string]: {
      start: number;
      end: number;
    };
  };
  private logPrefix: string;

  constructor() {
    this.firstPaintDuration = 0;
    this.googleAnalytics = {
      timingVar: "name",
      enable: false,
    };
    this.metrics = {};
    this.logPrefix = "⚡️ Perfume.js:";

    if (!this.supportsPerfNow) {
      throw Error(this.logPrefix + " Cannot be used in this browser.");
    }
  }

  /**
   * True if the browser supports the Navigation Timing API.
   * @type {boolean}
   */
  get supportsPerfNow() {
    return Boolean(window.performance && performance.now);
  }

  /**
   * True if the browser supports the User Timing API.
   * Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
   * @type {boolean}
   */
  get supportsPerfMark() {
    return Boolean(window.performance && performance.mark);
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
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made. Use User Timing API results if available, otherwise return
   * performance.now() fallback.
   * @param {string} metricName
   */
  public getDurationByMetric(metricName: string) {
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
   * @param {string} metricName
   */
  public checkMetricName(metricName: string) {
    if (metricName) {
      return true;
    }
    global.console.warn(this.logPrefix, "Please provide a metric name");
    return false;
  }

  /**
   * @param {string} metricName
   */
  public start(metricName: string) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.supportsPerfMark) {
      global.console.warn(this.logPrefix, `Timeline won"t be marked for "${metricName}".`);
    }
    if (this.metrics[metricName]) {
      global.console.warn(this.logPrefix, "Recording already started.");
      return;
    }
    this.metrics[metricName] = {
      end: 0,
      start: performance.now(),
    };
    if (this.supportsPerfMark) {
      performance.mark(`mark_${metricName}_start`);
    }
  }

  /**
   * @param {string} metricName
   * @param {boolean} log
   */
  public end(metricName: string, log = false) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.metrics[metricName]) {
      global.console.warn(this.logPrefix, "Recording already stopped.");
      return;
    }
    this.metrics[metricName].end = performance.now();
    if (this.supportsPerfMark) {
      const startMark = `mark_${metricName}_start`;
      const endMark = `mark_${metricName}_end`;
      performance.mark(endMark);
      performance.measure(metricName, startMark, endMark);
    }
    const duration = this.getDurationByMetric(metricName);
    if (log) {
      this.log(metricName, duration);
    }
    delete this.metrics[metricName];
    this.sendTiming(metricName, duration);
    return duration;
  }

  /**
   * http://msdn.microsoft.com/ff974719
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
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  public firstPaint() {
    setTimeout(() => {
      this.firstPaintDuration = this.getFirstPaint();
      if (this.firstPaintDuration) {
        this.log("firstPaint", this.firstPaintDuration);
      }
      this.sendTiming("firstPaint", this.firstPaintDuration);
    });
  }

  /**
   * Coloring Text in Browser Console
   * @param {string} metricName
   * @param {number} duration
   */
  public log(metricName: string, duration: number) {
    if (!metricName || !duration) {
      global.console.warn(this.logPrefix, "Please provide a metric name and the duration value");
      return;
    }
    const durationMs = duration.toFixed(2);
    const style = "color: #ff6d00;font-size:12px;";
    const text = `%c ${this.logPrefix} ${metricName} ${durationMs} ms`;
    global.console.log(text, style);
  }

  /**
   * Sends the User timing measure to Google Analytics.
   * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
   * @param {string} metricName
   * @param {number} duration
   */
  private sendTiming(metricName: string, duration: number) {
    if (!this.googleAnalytics.enable) {
      return;
    }
    if (!window.ga) {
      global.console.warn(this.logPrefix, "Google Analytics has not been loaded");
      return;
    }
    const durationMs = duration.toFixed(2);
    window.ga("send", "timing", metricName, this.googleAnalytics.timingVar, durationMs);
  }
}
