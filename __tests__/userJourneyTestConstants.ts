/* istanbul ignore file */

import {
  IUserJourneyThresholds,
  IPerfumeOptions,
  IPerfumeConfig,
  IThresholdTier,
  IUserJourneyStepsConfig,
} from '../src/types';

export const STEP_THRESHOLDS: IUserJourneyThresholds = {
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

const userJourneySteps: IUserJourneyStepsConfig = {
  load_second_screen_first_journey: {
    threshold: IThresholdTier.instant,
    marks: [
      'start_navigate_to_second_screen_first_journey',
      'loaded_second_screen_first_journey',
    ],
  },
  load_third_screen_first_journey: {
    threshold: IThresholdTier.quick,
    marks: [
      'start_navigate_to_third_screen_first_journey',
      'loaded_third_screen_first_journey',
    ],
  },
  load_fourth_screen_first_journey: {
    threshold: IThresholdTier.quick,
    marks: [
      'start_navigate_to_fourth_screen_first_journey',
      'loaded_fourth_screen_first_journey',
    ],
  },
  load_first_screen_second_journey: {
    threshold: IThresholdTier.unavoidable,
    marks: ['launch', 'loaded_first_screen_second_journey'],
  },
  load_second_screen_second_journey: {
    threshold: IThresholdTier.instant,
    marks: [
      'start_navigate_to_second_screen_second_journey',
      'loaded_second_screen_second_journey',
    ],
  },
  load_third_screen_second_journey: {
    threshold: IThresholdTier.quick,
    marks: [
      'start_navigate_to_third_screen_second_journey',
      'loaded_third_screen_second_journey',
    ],
  },
  load_fourth_screen_second_journey: {
    threshold: IThresholdTier.quick,
    marks: [
      'start_navigate_to_fourth_screen_second_journey',
      'loaded_fourth_screen_second_journey',
    ],
  },
};

export const testConfig: IPerfumeOptions = {
  userJourneySteps,
  onMarkJourney: jest.fn(),
};

export type TestConfig = IPerfumeConfig;
