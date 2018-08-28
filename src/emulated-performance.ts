import IPerformance from './performance-impl';
import { IMetrics, IPerfumeConfig } from './perfume';

export interface IPerformancePaintTiming {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

export default class EmulatedPerformance implements IPerformance {
  constructor(public config: IPerfumeConfig) {}

  /**
   * When performance API is not available
   * returns Date.now that is limited to one-millisecond resolution.
   */
  now(): number {
    return Date.now() / 1000;
  }

  mark(metricName: string, type: string): void {}

  measure(metricName: string, metrics: IMetrics): number {
    return this.getDurationByMetric(metricName, metrics);
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   * Uses setTimeout to retrieve FCP
   */
  firstContentfulPaint(cb: (entries: any[]) => void): void {
    setTimeout(() => {
      cb(this.getFirstPaint());
    });
  }

  /**
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made by now() fallback.
   */
  private getDurationByMetric(metricName: string, metrics: IMetrics): number {
    const duration = metrics[metricName].end - metrics[metricName].start;
    return duration || 0;
  }

  /**
   * http://msdn.microsoft.com/ff974719
   * developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart
   */
  private getFirstPaint(): IPerformancePaintTiming[] {
    const navTiming = window.performance.timing;
    const performancePaintTiming: IPerformancePaintTiming = {
      duration: 0,
      entryType: 'paint',
      name: 'first-contentful-paint',
      startTime: 0,
    };
    if (navTiming && navTiming.navigationStart !== 0) {
      performancePaintTiming.startTime = Date.now() - navTiming.navigationStart;
    }
    return [performancePaintTiming];
  }
}
