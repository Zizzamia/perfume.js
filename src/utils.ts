import { W } from './constants';

export const roundByTwo = (num: number) => {
  return parseFloat(num.toFixed(2));
}

export const convertToKB = (bytes: number): number | null => {
  if (typeof bytes !== 'number') {
    return null;
  }
  return roundByTwo(bytes / Math.pow(1024, 2));
};

/**
 * PushTask to requestIdleCallback
 */
export const pushTask = (cb: any): void => {
  if ('requestIdleCallback' in W) {
    (W as any).requestIdleCallback(cb, { timeout: 3000 });
  } else {
    cb();
  }
};

export const getDoNotTrack = (): boolean => {
  if (window.doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || 'msTrackingProtectionEnabled' in window.external) {
    if (window.doNotTrack == "1" || navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1" || window.external.msTrackingProtectionEnabled()) {
        return true
    } else {
        return false
    }
  } else {
      return false
  }
}
