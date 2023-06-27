/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '../_mock';
import { initPerfume } from '../../src/initPerfume';
import { steps } from '../../src/steps/steps';
import { setStepsMap } from '../../src/steps/setStepsMap';

import { testConfig } from '../stepsTestConstants';

describe('setSteps', () => {
  beforeEach(() => {
    (WP as any) = mock.performance();
    initPerfume(testConfig);
  });

  describe('correctly sets each map', () => {
    it('correctly sets the finalMarkToStepsMap map', () => {
      expect(steps.finalMarkToStepsMap).toMatchObject({
        loaded_first_screen_first_journey: {
          launch: ['load_first_screen_first_journey'],
        },
        loaded_second_screen_first_journey: {
          start_navigate_to_second_screen_first_journey: [
            'load_second_screen_first_journey',
          ],
        },
        loaded_third_screen_first_journey: {
          start_navigate_to_third_screen_first_journey: [
            'load_third_screen_first_journey',
          ],
        },
        loaded_fourth_screen_first_journey: {
          start_navigate_to_fourth_screen_first_journey: [
            'load_fourth_screen_first_journey',
          ],
        },
        loaded_first_screen_second_journey: {
          launch: ['load_first_screen_second_journey'],
        },
        loaded_second_screen_second_journey: {
          start_navigate_to_second_screen_second_journey: [
            'load_second_screen_second_journey',
          ],
        },
        loaded_third_screen_second_journey: {
          start_navigate_to_third_screen_second_journey: [
            'load_third_screen_second_journey',
          ],
          start_navigate_to_fourth_screen_second_journey: [
            'test_load_reusing_marks',
          ],
        },
        loaded_fourth_screen_second_journey: {
          start_navigate_to_fourth_screen_second_journey: [
            'load_fourth_screen_second_journey',
          ],
        },
      });
    });
    it('correctly sets the startMarkToStepsMap map', () => {
      expect(steps.startMarkToStepsMap).toMatchObject({
        launch: {
          load_first_screen_first_journey: true,
          load_first_screen_second_journey: true,
        },
        start_navigate_to_second_screen_first_journey: {
          load_second_screen_first_journey: true,
        },
        start_navigate_to_third_screen_first_journey: {
          load_third_screen_first_journey: true,
        },
        start_navigate_to_fourth_screen_first_journey: {
          load_fourth_screen_first_journey: true,
        },
        start_navigate_to_second_screen_second_journey: {
          load_second_screen_second_journey: true,
        },
        start_navigate_to_third_screen_second_journey: {
          load_third_screen_second_journey: true,
        },
        start_navigate_to_fourth_screen_second_journey: {
          load_fourth_screen_second_journey: true,
          test_load_reusing_marks: true,
        },
      });
    });

    it('returns when no steps are provided', () => { 
      initPerfume({});
      setStepsMap();
      expect(steps.finalMarkToStepsMap).toMatchObject({});
      expect(steps.finalMarkToStepsMap).toMatchObject({});
    })
  });
});
