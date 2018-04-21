import {Metrics, PerfumeConfig} from './perfume';

export default interface PerformImpl {
  config: PerfumeConfig;

  now(): number;

  mark(metricName: string, type: string): any;

  measure(metricName: string, metrics: Metrics): number;

  firstContentfulPaint(cb: any): any;
}
