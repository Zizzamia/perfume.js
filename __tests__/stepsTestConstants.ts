/* istanbul ignore file */

import {
  IStepsThresholds,
  IPerfumeOptions,
  IPerfumeConfig,
  IThresholdTier,
  IStepsConfig,
} from '../src/types';

export const STEP_THRESHOLDS: IStepsThresholds = {
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

const steps: IStepsConfig = {
  load_first_screen_first_journey: {
    threshold: IThresholdTier.unavoidable,
    marks: ['launch', 'loaded_first_screen_first_journey'],
  },
  load_second_screen_first_journey: {
    threshold: IThresholdTier.instant,
    marks: [
      'start_navigate_to_second_screen_first_journey',
      'loaded_second_screen_first_journey',
    ],
  },
  test_load_reusing_marks: {
    // step with the same start and end mark as another
    threshold: IThresholdTier.instant,
    marks: [
      'start_navigate_to_fourth_screen_second_journey',
      'loaded_third_screen_second_journey',
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
  steps,
  onMarkStep: jest.fn(),
};
export const navigationTestConfig: IPerfumeOptions = {
  steps,
  onMarkStep: jest.fn(),
};

export type TestConfig = IPerfumeConfig;
