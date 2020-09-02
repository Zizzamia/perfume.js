import { config } from './config';
import { logData } from './log';
import { rt } from './metrics';
import { IPerformanceEntry } from './types';

export const initResourceTiming = (performanceEntries: IPerformanceEntry[]) => {
  performanceEntries.forEach(entry => {
    if (config.isResourceTiming) {
      logData('resourceTiming', entry);
    }
    if (entry.decodedBodySize && entry.initiatorType) {
      const bodySize = entry.decodedBodySize / 1000;
      rt.value[entry.initiatorType] += bodySize;
      rt.value.total += bodySize;
    }
  });
};
