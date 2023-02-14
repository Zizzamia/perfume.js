/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '.././_mock';
import Perfume from '../../src/perfume'
import { markJourney } from '../../src/userJourney';
import { userJourneyMap} from '../../src/userJourneyMap'

import { testConfig } from '../userJourneyTestConstants';

describe('userJourneyMap', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    const perfume = new Perfume(testConfig);
  });

  describe('correctly sets each map', () => {
    it('correctly sets the activeSteps maps', () => {
        spy = jest.spyOn(WP, 'mark');
        markJourney('start_navigate_to_second_screen_first_journey');
        expect(spy.mock.calls.length).toBe(1);
        expect(spy).toHaveBeenCalledWith('user_journey_mark.start_navigate_to_second_screen_first_journey');
        expect(userJourneyMap.activeSteps).toMatchObject({"load_second_screen_first_journey": true})
    });

    it('correctly sets the finalMarkToStepsMap map', () => {
        expect(userJourneyMap.finalMarkToStepsMap).toMatchObject({
            "loaded_first_screen_first_journey":{
               "launch":[
                  "load_first_screen_first_journey"
               ]
            },
            "loaded_second_screen_first_journey":{
               "start_navigate_to_second_screen_first_journey":[
                  "load_second_screen_first_journey"
               ]
            },
            "loaded_third_screen_first_journey":{
               "start_navigate_to_third_screen_first_journey":[
                  "load_third_screen_first_journey"
               ]
            },
            "loaded_fourth_screen_first_journey":{
               "start_navigate_to_fourth_screen_first_journey":[
                  "load_fourth_screen_first_journey"
               ]
            },
            "loaded_first_screen_second_journey":{
               "launch":[
                  "load_first_screen_second_journey"
               ]
            },
            "loaded_second_screen_second_journey":{
               "start_navigate_to_second_screen_second_journey":[
                  "load_second_screen_second_journey"
               ]
            },
            "loaded_third_screen_second_journey":{
               "start_navigate_to_third_screen_second_journey":[
                  "load_third_screen_second_journey"
               ]
            },
            "loaded_fourth_screen_second_journey":{
               "start_navigate_to_fourth_screen_second_journey":[
                  "load_fourth_screen_second_journey"
               ]
            }
         })
    });
    it('correctly sets the startMarkToStepsMap map', () => {
        expect(userJourneyMap.startMarkToStepsMap).toMatchObject({
            "launch":{
               "load_first_screen_first_journey":true,
               "load_first_screen_second_journey":true
            },
            "start_navigate_to_second_screen_first_journey":{
               "load_second_screen_first_journey":true
            },
            "start_navigate_to_third_screen_first_journey":{
               "load_third_screen_first_journey":true
            },
            "start_navigate_to_fourth_screen_first_journey":{
               "load_fourth_screen_first_journey":true
            },
            "start_navigate_to_second_screen_second_journey":{
               "load_second_screen_second_journey":true
            },
            "start_navigate_to_third_screen_second_journey":{
               "load_third_screen_second_journey":true
            },
            "start_navigate_to_fourth_screen_second_journey":{
               "load_fourth_screen_second_journey":true
            }
         })
    });
    it('correctly sets the finalSteps map', () => {
        expect(userJourneyMap.finalSteps).toMatchObject({
            "load_fourth_screen_first_journey":[
               "first_journey"
            ],
            "load_fourth_screen_second_journey":[
               "second_journey"
            ]
         })
    });

  });
});