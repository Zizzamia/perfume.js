export default class GaQueueItem {
  metricName: string;
  duration: number;

  constructor(metricName: string, duration: number) {
    this.metricName = metricName;
    this.duration = duration;
  }
}
