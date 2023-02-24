/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '../_mock';
import Perfume from '../../src/perfume';
import { markStep } from '../../src/steps/markStep';
import { config } from '../../src/config';

import { testConfig } from '../stepsTestConstants';

describe('markStep', () => {
  let spy: jest.SpyInstance;
  let onMarkStepSpy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    new Perfume(testConfig);
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('callback onMarkStep', () => {
    it('start and finish one single step', () => {
      config.onMarkStep = () => {};
      onMarkStepSpy = jest.spyOn(config, 'onMarkStep');
      // start with the first mark
      markStep('start_navigate_to_second_screen_first_journey');

      expect(onMarkStepSpy).toHaveBeenCalledWith(
        'start_navigate_to_second_screen_first_journey',
        ['load_second_screen_first_journey'],
      );

      markStep('loaded_second_screen_first_journey');
      expect(onMarkStepSpy).toHaveBeenLastCalledWith(
        'loaded_second_screen_first_journey',
        [],
      );
    });
  });
});
