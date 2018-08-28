import Metric from './metric';

export default interface IAnalyticsTracker {
  name: string;
  metricQueue: Metric[];
  canSend(): boolean;
  send(metric: Metric): void;
}
