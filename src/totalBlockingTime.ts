import { fcp, tbt } from './metrics';
import { IPerformanceEntry } from './types';

export const initTotalBlockingTime = (
  performanceEntries: IPerformanceEntry[],
): void => {
  performanceEntries.forEach(performanceEntry => {
    if (
      performanceEntry.name !== 'self' ||
      performanceEntry.startTime < fcp.value
    ) {
      return;
    }
    const blockingTime = performanceEntry.duration - 50;
    if (blockingTime > 0) {
      tbt.value += blockingTime;
    }
  });
};
