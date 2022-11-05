import { IPerfumeData, IVitalsScore } from './types';

const rtScore = [100, 200];
const tbtScore = [200, 600];
const ntbtScore = [200, 600];

export const webVitalsScore: Record<string, number[]> = {
  rt: rtScore,
  tbt: tbtScore,
  ntbt: ntbtScore,
};

export const getVitalsScore = (
  measureName: string,
  value: IPerfumeData,
): IVitalsScore => {
  if (!webVitalsScore[measureName]) {
    return null;
  }
  if (value <= webVitalsScore[measureName][0]) {
    return 'good';
  }
  return value <= webVitalsScore[measureName][1] ? 'needsImprovement' : 'poor';
};
