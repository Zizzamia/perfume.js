import { logData, logMetric } from './log';
import { cls, lcp, rt, tbt } from './metrics';
import { poDisconnect } from './performanceObserver';
import { perfObservers } from './observeInstances';
import { IPerformanceEntry } from './types';

export const initFirstInputDelay = (
  performanceEntries: IPerformanceEntry[],
) => {
  const lastEntry = performanceEntries.pop();
  if (lastEntry) {
    logMetric(lastEntry.duration, 'fid');
  }
  poDisconnect(1);
  logMetric(lcp.value, 'lcp');
  if (perfObservers[3]) {
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
