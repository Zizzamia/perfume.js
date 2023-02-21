import { IThresholdTier, IUserJourneyThresholds } from "../types";
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