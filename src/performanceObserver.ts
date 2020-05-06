import { C } from './constants';
import { perfObservers } from './observeInstances';
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
      cb(entryList.getEntries());
    });
    // Retrieve buffered events and subscribe to newer events for Paint Timing
    perfObserver.observe({ type: eventType, buffered: true });
    return perfObserver;
  } catch (e) {
    C.warn('Perfume.js:', e);
  }
  return null;
};

export const poDisconnect = (observer: any) => {
  if (perfObservers[observer]) {
    perfObservers[observer].disconnect();
  }
  delete perfObservers[observer];
}
