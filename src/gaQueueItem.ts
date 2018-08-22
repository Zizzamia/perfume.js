export default class GaQueueItem {
    public metricName: string;
    public duration: number;

    constructor(metricName: string, duration: number) {
        this.metricName = metricName;
        this.duration = duration;
    }
}