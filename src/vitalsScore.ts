import {
  IPerfumeData,
  IThresholdTier,
  IUserJourneyThresholds,
  IVitalsScore,
} from './types';

const rtScore = [100, 200];
const tbtScore = [200, 600];
const ntbtScore = [200, 600];

export const USER_JOURNEY_THRESHOLDS: IUserJourneyThresholds = {
  [IThresholdTier.instant]: {
    vitalsThresholds: [100, 200],
    maxOutlierThreshold: 10000,
  },
  [IThresholdTier.quick]: {
    vitalsThresholds: [200, 500],
    maxOutlierThreshold: 10000,
  },
  [IThresholdTier.moderate]: {
    vitalsThresholds: [500, 1000],
    maxOutlierThreshold: 10000,
  },
  [IThresholdTier.slow]: {
    vitalsThresholds: [1000, 2000],
    maxOutlierThreshold: 10000,
  },
  [IThresholdTier.unavoidable]: {
    vitalsThresholds: [2000, 5000],
    maxOutlierThreshold: 20000,
  },
};

export const webVitalsScore: Record<string, number[]> = {
  RT: rtScore,
  TBT: tbtScore,
  NTBT: ntbtScore,
};

export const getRating = (
  value: number,
  vitalsThresholds: [number, number],
): IVitalsScore => {
  if (value <= vitalsThresholds[0]) {
    return 'good';
  }
  return value <= vitalsThresholds[1] ? 'needsImprovement' : 'poor';
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
