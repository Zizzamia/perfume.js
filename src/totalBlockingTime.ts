import { fcp, tbt } from './metrics';
import { IPerformanceEntry } from './types';

export const initTotalBlockingTime = (
  performanceEntries: IPerformanceEntry[],
): void => {
  performanceEntries.forEach(entry => {
    if (
      entry.name !== 'self' ||
      entry.startTime < fcp.value
    ) {
      return;
    }
    const blockingTime = entry.duration - 50;
    if (blockingTime > 0) {
      tbt.value += blockingTime;
    }
  });
};
