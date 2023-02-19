import { W } from './constants';

export const roundByFour = (num: number) => parseFloat(num.toFixed(4));

export const convertToKB = (bytes: number): number | null => {
  if (typeof bytes !== 'number') {
    return null;
  }
  return roundByFour(bytes / Math.pow(1024, 2));
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

export const getJourneyMarkName = (mark: string): string => `user_journey_mark.${mark}`