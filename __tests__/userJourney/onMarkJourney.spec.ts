/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '.././_mock';
import Perfume from '../../src/perfume'
import { markJourney, markJourneyOnce } from '../../src/userJourney';
import { config } from '../../src/config';

import { testConfig } from '../../src/userJourneyTestConstants';

describe('markJourneyOnce', () => {
  let spy: jest.SpyInstance;
  let analyticsTrackerSpy: jest.SpyInstance; 
  let measureSpy: jest.SpyInstance;
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

        //something is not correct with finding the currently active steps
        expect(onMarkJourneySpy).toHaveBeenCalledWith('start_navigate_to_second_screen_first_journey', [
          'load_second_screen_first_journey',
        ]);

        markJourney('loaded_second_screen_first_journey');
        // we should receive an empty step array because we finished the step
        expect(onMarkJourneySpy).toHaveBeenCalledWith('loaded_second_screen_first_journey', []);
      });

    it('two running steps', () => {
        config.onMarkJourney = () => {}
        onMarkJourneySpy = jest.spyOn(config, 'onMarkJourney');
        // start the first one
        markJourney('start_navigate_to_second_screen_first_journey');
        expect(onMarkJourneySpy).toHaveBeenCalledWith('start_navigate_to_second_screen_first_journey', [
        'load_second_screen_first_journey',
        ]);

        // start the second one
        markJourney('start_navigate_to_third_screen_first_journey');
        expect(onMarkJourneySpy).toHaveBeenCalledWith('start_navigate_to_third_screen_first_journey', [
            'load_second_screen_first_journey',
            'load_third_screen_first_journey',
        ]);

        // close the second one
        markJourney('loaded_third_screen_first_journey');
        expect(onMarkJourneySpy).toHaveBeenCalledWith('loaded_third_screen_first_journey', [
            'load_second_screen_first_journey',
        ]);

        // close the first one
        markJourney('loaded_second_screen_first_journey');
        expect(onMarkJourneySpy).toHaveBeenCalledWith('loaded_second_screen_first_journey', []);
    })  
  })
});