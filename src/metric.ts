export default class Metric {
  name: string;
  duration: number;

  constructor(metricName: string, duration: number) {
    this.name = metricName;
    this.duration = duration;
  }
}
