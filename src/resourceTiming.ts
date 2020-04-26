import { config } from './config';
import { logData } from './log';
import { rt } from './metrics';
import { IPerformanceEntry } from './types';

export const initResourceTiming = (performanceEntries: IPerformanceEntry[]) => {
  performanceEntries.forEach(performanceEntry => {
    if (config.isResourceTiming) {
      logData('resourceTiming', performanceEntry);
    }
    if (performanceEntry.decodedBodySize && performanceEntry.initiatorType) {
      const bodySize = performanceEntry.decodedBodySize / 1000;
      rt.value[performanceEntry.initiatorType] += bodySize;
      rt.value.total += bodySize;
    }
  });
};
