import IAnalyticsTracker from './analytics-tracker';
import Metric from './metric';

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ga: any;
  }
}

export default class GoogleAnalyticsTracker implements IAnalyticsTracker {
  name: string = 'Google Analytics';
  metricQueue: Metric[] = [];
  timingVar: string = 'name';

  canSend(): boolean {
    return window.ga && typeof window.ga === 'function';
  }

  /**
   * Sends a timing to Google Analytics.
   * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
   * timingCategory: metric.name
   * timingVar: this.timingVar
   * timingValue: metric.duration rounded to the nearest integer
   * @param metric Metric details to send
   */
  send(metric: Metric): void {
    window.ga(
      'send',
      'timing',
      metric.name,
      this.timingVar,
      Math.round(metric.duration),
    );
  }
}
