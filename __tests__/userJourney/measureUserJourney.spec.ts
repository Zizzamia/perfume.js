/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '.././_mock';
import Perfume from '../../src/perfume';
import { markJourney } from '../../src/userJourney/markJourney';
import { config } from '../../src/config';

import { testConfig } from '../userJourneyTestConstants';

describe('measureUserJourney', () => {
  let spy: jest.SpyInstance;
  let analyticsTrackerSpy: jest.SpyInstance;

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
  describe('metric when measures the final step', () => {
    it('should log the entire journey', async () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(WP, 'mark');
      analyticsTrackerSpy = jest.spyOn(config, 'analyticsTracker');
      const measureEntries: Record<string, PerformanceMeasure> = {
        'user_journey_step.load_first_screen_first_journey': {
          name: 'user_journey_step.load_first_screen_first_journey',
          entryType: 'measure',
          duration: 2000,
          startTime: 0,
          toJSON: jest.fn(),
          detail: '',
        },
        'user_journey_step.load_second_screen_first_journey': {
          name: 'user_journey_step.load_second_screen_first_journey',
          entryType: 'measure',
          duration: 250,
          startTime: 3300,
          toJSON: jest.fn(),
          detail: '',
        },
        'user_journey_step.load_third_screen_first_journey': {
          name: 'user_journey_step.load_third_screen_first_journey',
          entryType: 'measure',
          duration: 333,
          startTime: 12500,
          toJSON: jest.fn(),
          detail: '',
        },
        'user_journey_step.load_fourth_screen_first_journey': {
          name: 'user_journey_step.load_fourth_screen_first_journey',
          entryType: 'measure',
          duration: 7777,
          startTime: 38000,
          toJSON: jest.fn(),
          detail: '',
        },
        'user_journey_step.load_first_screen_second_journey': {
          name: 'user_journey_step.load_first_screen_second_journey',
          entryType: 'measure',
          duration: 45000,
          startTime: 0,
          toJSON: jest.fn(),
          detail: '',
        },
      };
      jest.spyOn(WP, 'getEntriesByName').mockImplementation(name => {
        const entries: Record<string, PerformanceEntry> = {
          'user_journey_mark.loaded_first_screen_first_journey': {
            name: 'user_journey_mark.loaded_first_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
          'user_journey_mark.start_navigate_to_second_screen_first_journey': {
            name: 'user_journey_mark.start_navigate_to_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
          'user_journey_mark.loaded_second_screen_first_journey': {
            name: 'user_journey_mark.loaded_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
          'user_journey_mark.start_navigate_to_third_screen_first_journey': {
            name: 'user_journey_mark.start_navigate_to_third_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
          'user_journey_mark.loaded_third_screen_first_journey': {
            name: 'user_journey_mark.loaded_third_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
          'user_journey_mark.start_navigate_to_fourth_screen_first_journey': {
            name: 'user_journey_mark.start_navigate_to_fourth_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
          'user_journey_mark.loaded_fourth_screen_first_journey': {
            name: 'user_journey_mark.loaded_fourth_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
          ...measureEntries,
        };
        return entries[name] ? [entries[name]] : [];
      });
      jest
        .spyOn(WP, 'measure')
        .mockImplementation(journeyName => measureEntries[journeyName] ?? {});
      markJourney('loaded_first_screen_first_journey');
      // we wait for promises to flush since getting the launch time duration is async
      await Promise.resolve();
      markJourney('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(2);
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(1);
      expect(analyticsTrackerSpy).toHaveBeenLastCalledWith({
        attribution: { category: 'user_journey_step' },
        metricName: 'load_first_screen_first_journey',
        rating: 'good',
        data: 2000,
        navigationType: undefined,
        navigatorInformation: {
          deviceMemory: 0,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
      markJourney('loaded_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(3);
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(2);
      expect(analyticsTrackerSpy).toHaveBeenLastCalledWith({
        metricName: 'load_second_screen_first_journey',
        rating: 'poor',
        data: 250,
        attribution: { category: 'user_journey_step' },
        navigationType: undefined,
        navigatorInformation: {
          deviceMemory: 0,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
      markJourney('start_navigate_to_third_screen_first_journey');
      expect(spy.mock.calls.length).toBe(4);
      markJourney('loaded_third_screen_first_journey');
      expect(spy.mock.calls.length).toBe(5);
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(3);
      expect(analyticsTrackerSpy).toHaveBeenLastCalledWith({
        metricName: 'load_third_screen_first_journey',
        rating: 'needsImprovement',
        data: 333,
        attribution: {        category: 'user_journey_step',
    },
        navigationType: undefined,
        navigatorInformation: {
          deviceMemory: 0,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
      markJourney('start_navigate_to_fourth_screen_first_journey');
      markJourney('loaded_fourth_screen_first_journey');
      expect(spy.mock.calls.length).toBe(7);
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(5);
      expect(analyticsTrackerSpy).toHaveBeenCalledWith({
        metricName: 'first_journey',
        value: 10360,
        attribution: {
            category: "user_journey",
        },
        data: 250,
        navigationType: undefined,
        navigatorInformation: {
        deviceMemory: 0,
        hardwareConcurrency: 12,
        isLowEndDevice: false,
        isLowEndExperience: false,
        serviceWorkerStatus: "unsupported",
        },
        rating: "poor",
      });
    });
  });
});
