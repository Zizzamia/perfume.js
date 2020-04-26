import { logWarn } from './log';
import { IPerformanceObserverType } from './types';

/**
 * PerformanceObserver subscribes to performance events as they happen
 * and respond to them asynchronously.
 */
export const po = (
  eventType: IPerformanceObserverType,
  cb: (performanceEntries: any[]) => void,
): PerformanceObserver | null => {
  try {
    const perfObserver = new PerformanceObserver(entryList => {
      const performanceEntries = entryList.getEntries();
      cb(performanceEntries);
    });
    // Retrieve buffered events and subscribe to newer events for Paint Timing
    perfObserver.observe({ type: eventType, buffered: true });
    return perfObserver;
  } catch (e) {
    logWarn(e);
  }
  return null;
};
