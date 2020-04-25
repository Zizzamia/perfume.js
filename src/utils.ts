import { W } from './constants';

export const convertToKB = (bytes: number): number | null => {
  if (typeof bytes !== 'number') {
    return null;
  }
  return parseFloat((bytes / Math.pow(1024, 2)).toFixed(2));
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
