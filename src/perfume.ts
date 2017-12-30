export default class Perfume {
  private metrics: {
    [key: string]: {
      start: number;
      end: number;
    };
  };
  private logPrefix: string;

  constructor() {
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
   */
  public getMeasurementForGivenName(metricName: string) {
    return performance.getEntriesByName(metricName)[0];
  }

  /**
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made. Use User Timing API results if available, otherwise return
   * performance.now() fallback.
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
   *
   */
  public checkMetricName(metricName: string) {
    if (metricName) {
      return true;
    }
    global.console.warn(this.logPrefix, "Please provide a metric name");
    return false;
  }

  /**
   *
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
   *
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
    return null;
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  public firstPaint() {
    setTimeout(() => {
      const fp = this.getFirstPaint();
      if (fp) {
        this.log("firstPaint", fp);
      }
    });
  }

  /**
   * Coloring Text in Browser Console
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
}
