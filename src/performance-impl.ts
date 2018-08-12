import { IMetrics, IPerfumeConfig } from './perfume';

export default interface IPerformance {
  config: IPerfumeConfig;

  now(): number;

  mark(metricName: string, type: string): any;

  measure(metricName: string, metrics: IMetrics): number;

  firstContentfulPaint(cb: any): any;
}
