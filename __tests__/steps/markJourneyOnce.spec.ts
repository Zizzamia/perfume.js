/**
 *
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '../_mock';
import Perfume from '../../src/perfume';
import { markStepOnce } from '../../src/steps/markStepOnce';

import { testConfig } from '../stepsTestConstants';

describe('markStepOnce', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    const perfume = new Perfume(testConfig);
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('markStepOnce()', () => {
    it('using the markJourneyOnce function should call WP.mark with the journey name', () => {
      jest.spyOn(WP, 'getEntriesByName').mockImplementation(() => []);
      spy = jest.spyOn(WP, 'mark');
      markStepOnce('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(
        'mark.start_navigate_to_second_screen_first_journey',
      );
    });
  });
});
