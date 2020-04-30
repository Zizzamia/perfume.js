import { logData, logMetric } from './log';
import {
  cls,
  clsMetricName,
  lcp,
  lcpMetricName,
  rt,
  tbt,
  tbtMetricName,
} from './metrics';
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
  if (perfObservers[2]) {
    logMetric(lcp.value, lcpMetricName);
  }
  if (perfObservers[3]) {
    perfObservers[3].takeRecords();
    logMetric(cls.value, clsMetricName);
  }
  // TBT by FID
  if (perfObservers[4]) {
    logMetric(tbt.value, tbtMetricName);
    // TBT with 5 second delay after FID
    setTimeout(() => {
      logMetric(tbt.value, `${tbtMetricName}5S`);
    }, 5000);
  }
  // TBT with 10 second delay after FID
  setTimeout(() => {
    if (perfObservers[4]) {
      logMetric(tbt.value, `${tbtMetricName}10S`);
      poDisconnect(4);
    }
    // Report Data Consumption
    logData('dataConsumption', rt.value);
  }, 10000);
};
