import PerformImpl from "./performance-impl";

export default class EmulatedPerformance implements PerformImpl {
  config: any;

  /**
   * When performance API is not available
   * returns Date.now that is limited to one-millisecond resolution.
   * @type {number}
   */
  public now(): number {
    return Date.now() / 1000;
  }

  /**
   * @param {string} metricName
   * @param {string} type
   */
  public mark(metricName: string, type: string) {
    global.console.warn(this.config.logPrefix, `Timeline won't be marked for "${metricName}".`);
  }

  /**
   * @param {string} metricName
   * @param {object} metrics
   */
  public measure(metricName: string, metrics: object): number {
    return this.getDurationByMetric(metricName, metrics);
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   * Uses setTimeout to retrieve FCP
   */
  public firstContentfulPaint() {
    setTimeout(() => {
      this.logFCP(this.getFirstPaint());
    });
  }

  /**
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made by now() fallback.
   *
   * @param {string} metricName
   * @param {metrics} any
   */
  private getDurationByMetric(metricName: string, metrics: any) {
    const duration = metrics[metricName].end - metrics[metricName].start;
    return duration || -1;
  }

  /**
   * http://msdn.microsoft.com/ff974719
   * developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart
   */
  private getFirstPaint() {
    const navTiming = window.performance.timing;
    if (navTiming && navTiming.navigationStart !== 0) {
      return Date.now() - navTiming.navigationStart;
    }
    return 0;
  }
}