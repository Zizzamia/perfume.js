declare const PerformanceObserver: any;

declare interface IPerformanceObserverEntryList {
  getEntries: any;
  getEntriesByName: any;
  getEntriesByType: any;
}

// Creates a PerformanceObserver instance and starts observing longtask entry types.
// This snippet is a temporary workaround, until browsers implement level 2
// of the Performance Observer spec and include the buffered flag
export default class PerformanceObserverTTI {
  g: any;

  create() {
    if ('PerformanceLongTaskTiming' in window) {
      this.g = ((window as any).__tti = { e: [] }) as any;
      this.g.o = new PerformanceObserver((l: IPerformanceObserverEntryList) => {
        this.g.e = this.g.e.concat(l.getEntries());
      });
      this.g.o.observe({ entryTypes: ['longtask'] });
    }
  }
}
