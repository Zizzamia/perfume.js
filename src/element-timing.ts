import { logMetric } from './log';
import { IPerformanceEntry } from './types';


export const initElementTiming = (
  performanceEntries: IPerformanceEntry[],
) => {
  performanceEntries.forEach(entry => {
    if (entry.identifier) {
      logMetric(entry.startTime, entry.identifier);
    }
  });
};
