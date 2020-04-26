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
import { perfObservers } from './observeInstances';
import { IPerformanceEntry } from './types';

export const initFirstInputDelay = (
  performanceEntries: IPerformanceEntry[],
) => {
  const lastEntry = performanceEntries.pop();
  if (lastEntry) {
    logMetric(lastEntry.duration, 'fid');
  }
  perfObservers.fid.disconnect();
  if (perfObservers.lcp) {
    logMetric(lcp.value, lcpMetricName);
  }
  if (perfObservers.cls) {
    perfObservers.cls.takeRecords();
    logMetric(cls.value, clsMetricName, '');
  }
  // TBT by FID
  if (perfObservers.tbt) {
    logMetric(tbt.value, tbtMetricName);
  }
  // TBT with 5 second delay after FID
  setTimeout(() => {
    if (perfObservers.tbt) {
      logMetric(tbt.value, `${tbtMetricName}5S`);
    }
  }, 5000);
  // TBT with 10 second delay after FID
  setTimeout(() => {
    if (perfObservers.tbt) {
      logMetric(tbt.value, `${tbtMetricName}10S`);
      perfObservers.tbt.disconnect();
    }
    // Report Data Consumption
    logData('dataConsumption', rt.value);
  }, 10000);
};
