import { IPerfumeData, IVitalsScore } from './types';

const ttfbScore = [200, 500];
const fcpScore = [2000, 4000];
const lcpScore = [2500, 4000];
const fidcore = [100, 300];
const clsScore = [0.1, 0.25];
const tbtScore = [200, 600];
const ntbtScore = [200, 600];

export const webVitalsScore: Record<string, number[]> = {
  ttfb: ttfbScore,
  fp: fcpScore,
  fcp: fcpScore,
  lcp: lcpScore,
  lcpFinal: lcpScore,
  fid: fidcore,
  cls: clsScore,
  clsFinal: clsScore,
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
