import { IVitalsScore } from '../types';

export const getRating = (
  value: number,
  vitalsThresholds: [number, number],
): IVitalsScore => {
  if (value <= vitalsThresholds[0]) {
    return 'good';
  }
  return value <= vitalsThresholds[1] ? 'needsImprovement' : 'poor';
};
