import { Metrics } from "./perfume";

export default interface PerformImpl {
  config: any;
  now(): number;
  mark(metricName: string, type: string): any;
  measure(metricName: string, metrics: Metrics): number;
  firstContentfulPaint(cb: any): any;
}
