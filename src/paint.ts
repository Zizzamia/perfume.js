import { logMetric } from './log';
import { fcp, fcpEntryName, lcp } from './metrics';
import { perfObservers } from './observeInstances';
import { po, poDisconnect } from './performanceObserver';
import { initTotalBlockingTime } from './totalBlockingTime';
import { IPerformanceEntry } from './types';

/**
 * First Paint is essentially the paint after which
 * the biggest above-the-fold layout change has happened.
 */
export const initFirstPaint = (performanceEntries: IPerformanceEntry[]) => {
  performanceEntries.forEach(entry => {
    if (entry.name === 'first-paint') {
      logMetric(entry.startTime, 'fp');
    } else if (entry.name === fcpEntryName) {
      fcp.value = entry.startTime;
      logMetric(fcp.value, 'fcp');
      perfObservers[4] = po('longtask', initTotalBlockingTime);
      poDisconnect(0);
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

export const initElementTiming = (
  performanceEntries: IPerformanceEntry[],
) => {
  performanceEntries.forEach(entry => {
    if (entry.identifier) {
      logMetric(entry.startTime, entry.identifier);
    }
  });
};
