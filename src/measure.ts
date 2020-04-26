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
  const startMark = `mark_${measureName}_start`;
  const endMark = `mark_${measureName}_end`;
  WP.measure(measureName, startMark, endMark);
  return getDurationByMetric(measureName);
};
