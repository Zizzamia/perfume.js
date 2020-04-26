import { logMetric } from './log';
import { fcp, fcpEntryName, lcp } from './metrics';
import { perfObservers } from './observeInstances';
import { po } from './performanceObserver';
import { initTotalBlockingTime } from './totalBlockingTime';
import { IPerformanceEntry } from './types';

/**
 * First Paint is essentially the paint after which
 * the biggest above-the-fold layout change has happened.
 */
export const initFirstPaint = (performanceEntries: IPerformanceEntry[]) => {
  performanceEntries.forEach(performanceEntry => {
    if (performanceEntry.name === 'first-paint') {
      logMetric(performanceEntry.startTime, 'firstPaint');
    } else if (performanceEntry.name === fcpEntryName) {
      logMetric(performanceEntry.startTime, 'firstContentfulPaint');
    }
    if (performanceEntry.name === fcpEntryName) {
      fcp.value = performanceEntry.startTime;
      perfObservers.tbt = po('longtask', initTotalBlockingTime);
      perfObservers.fcp.disconnect();
    }
  });
};

export const initLargestContentfulPaint = (
  performanceEntries: IPerformanceEntry[],
) => {
  const lastEntry = performanceEntries.pop();
  if (lastEntry) {
    lcp.value = lastEntry.renderTime || lastEntry.loadTime;
  }
};
