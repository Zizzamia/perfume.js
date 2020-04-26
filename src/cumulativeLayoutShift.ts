import { cls } from './metrics';
import { IPerformanceEntry } from './types';

/**
 * Detects new layout shift occurrences and updates the
 * `cumulativeLayoutShiftScore` variable.
 */
export const initLayoutShift = (performanceEntries: IPerformanceEntry[]) => {
  const lastEntry = performanceEntries.pop();
  // Only count layout shifts without recent user input.
  if (lastEntry && !lastEntry.hadRecentInput && lastEntry.value) {
    cls.value += lastEntry.value;
  }
};
