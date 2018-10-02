export default class PerformanceEntryItem {
  name: string;
  duration: number;

  constructor(name: string, duration: number) {
    this.name = name;
    this.duration = duration;
  }
}
