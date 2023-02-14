/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '.././_mock';
import Perfume from '../../src/perfume'
import { markJourney, markJourneyOnce } from '../../src/userJourney';
import { config } from '../../src/config';

import { testConfig } from '../userJourneyTestConstants';

describe('markJourneyOnce', () => {
  let spy: jest.SpyInstance;
  let onMarkJourneySpy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    const perfume = new Perfume(testConfig);
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  })


  describe('callback markJourney', () => {
    it('start and finish one single step', () => {
        config.onMarkJourney = () => {}
        onMarkJourneySpy = jest.spyOn(config, 'onMarkJourney');
        // start with the first mark
        markJourney('start_navigate_to_second_screen_first_journey');

        expect(onMarkJourneySpy).toHaveBeenCalledWith('start_navigate_to_second_screen_first_journey', [
          'load_second_screen_first_journey',
        ]);

        markJourney('loaded_second_screen_first_journey');
        expect(onMarkJourneySpy).toHaveBeenLastCalledWith('loaded_second_screen_first_journey', ['load_second_screen_first_journey']);
      });
  })
});