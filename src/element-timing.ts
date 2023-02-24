import { logMetric } from './log';
import { IPerformanceEntry } from './types';

export const initElementTiming = (performanceEntries: IPerformanceEntry[]) => {
  performanceEntries.forEach(entry => {
    if (entry.identifier) {
      logMetric({
        attribution: {
          identifier: entry.identifier,
        },
        name: 'ET',
        rating: null,
        value: entry.startTime,
      });
    }
  });
};
