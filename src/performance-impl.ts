
export default interface PerformImpl {
  config: any;
  now(): number;
  mark(metricName: string, type: string): any;
  measure(metricName: string, metrics: object): number;
  firstContentfulPaint(cb: any): any;
}
