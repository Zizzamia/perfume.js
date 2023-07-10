/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '../_mock';
import { initPerfume } from '../../src/initPerfume';
import { markStep } from '../../src/steps/markStep';
import { getNavigationState } from '../../src/steps/steps';
import {
  getActiveStepsFromNavigationSteps,
  advanceUJStep,
} from '../../src/steps/navigationSteps';

import { navigationTestConfig } from '../stepsTestConstants';

describe('navSteps', () => {
  let spy: jest.SpyInstance;
  let onMarkStepSpy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    initPerfume(navigationTestConfig);
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('getNavigationState ', () => {
    it('records the start mark in the navigation state', () => {
      markStep('start_navigate_to_second_screen_first_journey');
      expect(getNavigationState()).toMatchObject({
        0: {
          start_navigate_to_second_screen_first_journey: true,
        },
      });
    });

    it('records the end mark clears the navigation step in the state', () => {
      markStep('start_navigate_to_second_screen_first_journey');
      expect(getNavigationState()).toMatchObject({
        0: {
          start_navigate_to_second_screen_first_journey: true,
        },
      });

      markStep('loaded_second_screen_first_journey');
      expect(getNavigationState()).toMatchObject({});
    });

    it('incrementCujNavigation the navigation state on page navigations', () => {
      advanceUJStep();
      expect(getNavigationState()).toMatchObject({ 0: {} });
      advanceUJStep();
      expect(getNavigationState()).toMatchObject({ 0: {}, 1: {} });
    });
  });

  describe('getActiveStepsFromNavigationSteps', () => {
    it('returns and empty list if there are not navigations steps recorded', () => {
      expect(getActiveStepsFromNavigationSteps()).toEqual({});
    });

    it('returns load_home_screen as an active step', () => {
      markStep('start_navigate_to_second_screen_first_journey');
      expect(getActiveStepsFromNavigationSteps()).toEqual({
        load_second_screen_first_journey: true,
      });
    });

    it('returns load_second_screen_first_journey and load_third_screen_first_journey as an active step', () => {
      markStep('start_navigate_to_second_screen_first_journey');
      expect(getActiveStepsFromNavigationSteps()).toEqual({
        load_second_screen_first_journey: true,
      });
      markStep('start_navigate_to_third_screen_first_journey');
      expect(getActiveStepsFromNavigationSteps()).toEqual({
        load_second_screen_first_journey: true,
        load_third_screen_first_journey: true,
      });
    });

    it('returns the active steps for the last navigation step', () => {
      // load app
      advanceUJStep();

      markStep('start_navigate_to_second_screen_first_journey');
      expect(getNavigationState()).toMatchObject({
        0: {
          start_navigate_to_second_screen_first_journey: true,
        },
      });
      expect(getActiveStepsFromNavigationSteps()).toEqual({
        load_second_screen_first_journey: true,
      });
    });

    it('returns the active steps for the last 2 navigation steps', () => {
      markStep('start_navigate_to_second_screen_first_journey');
      // load some next page
      advanceUJStep();
      markStep('start_navigate_to_third_screen_first_journey');

      advanceUJStep();
      markStep('start_navigate_to_fourth_screen_first_journey');
      expect(getNavigationState()).toMatchObject({
        0: {
          start_navigate_to_second_screen_first_journey: true,
        },
      });

      expect(getActiveStepsFromNavigationSteps()).toEqual({
        load_fourth_screen_first_journey: true,
        load_third_screen_first_journey: true,
      });
    });

    it('does not return stale steps - i.e. steps older than the last 2 navigations', () => {
      // navigate to some page
      advanceUJStep();
      markStep('start_navigate_to_second_screen_first_journey');

      // navigate to next page
      advanceUJStep();
      markStep('start_navigate_to_third_screen_first_journey');

      // navigate to a third page
      advanceUJStep();
      markStep('start_navigate_to_fourth_screen_first_journey');

      expect(getNavigationState()).toMatchObject({
        0: {
          start_navigate_to_second_screen_first_journey: true, // stale step
        },
        1: {
          start_navigate_to_third_screen_first_journey: true,
        },
        2: {
          start_navigate_to_fourth_screen_first_journey: true,
        },
      });

      expect(getActiveStepsFromNavigationSteps()).toEqual({
        load_fourth_screen_first_journey: true,
        load_third_screen_first_journey: true,
      });
    });
  });
});
