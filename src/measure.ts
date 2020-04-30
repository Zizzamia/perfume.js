import { WP } from './constants';

/**
 * Get the duration of the timing metric or -1
 * if there a measurement has not been made by the User Timing API
 */
export const performanceMeasure = (measureName: string): number => {
  WP.measure(
    measureName,
    `mark_${measureName}_start`,
    `mark_${measureName}_end`,
  );
  const entry = WP.getEntriesByName(measureName).pop();
  if (entry && entry.entryType === 'measure') {
    return entry.duration;
  }
  return -1;
};
