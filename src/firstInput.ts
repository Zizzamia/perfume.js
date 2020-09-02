import { logData, logMetric } from './log';
import { cls, lcp, rt, tbt } from './metrics';
import { perfObservers } from './observeInstances';
import { poDisconnect } from './performanceObserver';
import { PerformanceEventTiming } from './types';

export const initFirstInputDelay = (
  performanceEntries: PerformanceEventTiming[],
) => {
  const lastEntry = performanceEntries.pop();
  if (lastEntry) {
    // Core Web Vitals FID logic
    // Measure the delay to begin processing the first input event
    logMetric(lastEntry.processingStart - lastEntry.startTime, 'fidVitals', {
      performanceEntry: lastEntry
    });
    // Legacy FID logic
    // Measure the duration of processing the first input event
    logMetric(lastEntry.duration, 'fid', {
      performanceEntry: lastEntry
    });
  }
  // Disconnect this observer since callback is only triggered once
  poDisconnect(1);
  logMetric(lcp.value, 'lcp');
  if (perfObservers[3] && typeof perfObservers[3].takeRecords === 'function') {
    perfObservers[3].takeRecords();
  }
  logMetric(cls.value, 'cls');
  logMetric(tbt.value, 'tbt');
  // TBT with 5 second delay after FID
  setTimeout(() => {
    logMetric(tbt.value, `tbt5S`);
  }, 5000);
  // TBT with 10 second delay after FID
  setTimeout(() => {
    logMetric(tbt.value, `tbt10S`);
    logData('dataConsumption', rt.value);
  }, 10000);
};
