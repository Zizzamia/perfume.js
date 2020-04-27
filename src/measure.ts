import { WP } from './constants';

/**
 * Get the duration of the timing metric or -1 if there a measurement has
 * not been made by the User Timing API
 */
export const getDurationByMetric = (measureName: string): number => {
  const performanceEntries = WP.getEntriesByName(measureName);
  const entry = performanceEntries[performanceEntries.length - 1];
  if (entry && entry.entryType === 'measure') {
    return entry.duration;
  }
  return -1;
};

export const performanceMeasure = (measureName: string): number => {
  WP.measure(
    measureName,
    `mark_${measureName}_start`,
    `mark_${measureName}_end`,
  );
  return getDurationByMetric(measureName);
};
