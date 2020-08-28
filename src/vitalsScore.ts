import { IPerfumeData, IVitalsScore } from './types';

const fcpScore = [1000, 2500];
const lcpScore = [2500, 4000];
const clsScore = [0.1, 0.25];
const tbtScore = [300, 600];

export const webVitalsScore: Record<string, number[]> = {
  fp: fcpScore,
  fcp: fcpScore,
  lcp: lcpScore,
  lcpFinal: lcpScore,
  fid: [100, 300],
  fidVitals: [100, 300],
  cls: clsScore,
  clsFinal: clsScore,
  tbt: tbtScore,
  tbt5S: tbtScore,
  tbt10S: tbtScore,
  tbtFinal: tbtScore,
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
