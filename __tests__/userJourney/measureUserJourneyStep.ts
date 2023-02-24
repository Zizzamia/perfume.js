/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '.././_mock';
import Perfume from '../../src/perfume';
import { markJourney } from '../../src/userJourney/markJourney';
import { config } from '../../src/config';

import { testConfig } from '../userJourneyTestConstants';

describe('measureUserJourneyStep', () => {
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
  });

  describe('when two marks are not part of the same step', () => {
    it('should not run analyticsTracker', () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(WP, 'mark');
      analyticsTrackerSpy = jest.spyOn(config, 'analyticsTracker');
      markJourney('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(
        'user_journey_mark.start_navigate_to_second_screen_first_journey',
      );
      markJourney('start_navigate_to_third_screen_first_journey');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenLastCalledWith(
        'user_journey_mark.start_navigate_to_third_screen_first_journey',
      );
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('when two marks are apart of the same step', () => {
    it('shold run analyticsTracker', () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(WP, 'mark');
      measureSpy = jest.spyOn(WP, 'measure');
      analyticsTrackerSpy = jest.spyOn(config, 'analyticsTracker');
      markJourney('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(
        'user_journey_mark.start_navigate_to_second_screen_first_journey',
      );
      // ============ Mock Data ============
      jest.spyOn(WP, 'getEntriesByName').mockImplementationOnce(name => {
        const entries: Record<string, PerformanceEntry> = {
          'user_journey_mark.start_navigate_to_second_screen_first_journey': {
            name: 'user_journey_mark.start_navigate_to_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 0,
            toJSON: jest.fn(),
          },
        };
        return [entries[name]] ?? [];
      });
      jest.spyOn(WP, 'measure').mockImplementationOnce(() => ({
        name: 'user_journey_mark.start_navigate_to_second_screen_first_journey',
        entryType: 'mark',
        duration: 100,
        startTime: 0,
        toJSON: jest.fn(),
        detail: '',
      }));
      // ========== Mock Data end ==========
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(0);
      // ============ Mock Data ============
      jest.spyOn(WP, 'getEntriesByName').mockImplementationOnce(name => {
        const entries: Record<string, PerformanceEntry> = {
          'user_journey_mark.start_navigate_to_second_screen_first_journey': {
            name: 'user_journey_mark.start_navigate_to_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 0,
            toJSON: jest.fn(),
          },
          'user_journey_mark.loaded_second_screen_first_journey': {
            name: 'user_journey_mark.loaded_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
        };
        return [entries[name]] ?? [];
      });
      // ========== Mock Data end ==========
      markJourney('loaded_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenLastCalledWith(
        'user_journey_mark.loaded_second_screen_first_journey',
      );
      expect(measureSpy).toHaveBeenCalledTimes(2);
      expect(measureSpy).toHaveBeenCalledWith(
        'user_journey_step.load_second_screen_first_journey',
        'user_journey_mark.start_navigate_to_second_screen_first_journey',
        'user_journey_mark.loaded_second_screen_first_journey',
      );
      expect(measureSpy).toHaveBeenLastCalledWith(
        'user_journey_step.load_second_screen_first_journey_vitals_good',
        {
          detail: {
            duration: 100,
            type: 'userJourneyStepVital',
          },
          end: 100,
          start: 100,
        },
      );
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(1);
      expect(analyticsTrackerSpy).toHaveBeenCalledWith({
        attribution: { category: 'user_journey_step' },
        metricName: 'load_second_screen_first_journey',
        rating: 'good',
        data: 100,
        navigationType: undefined,
        navigatorInformation: {
          deviceMemory: 0,
          hardwareConcurrency: 8,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });

    it('should run analyticsTracker with duration starting from App launch', async () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(WP, 'mark');
      measureSpy = jest.spyOn(WP, 'measure');
      analyticsTrackerSpy = jest.spyOn(config, 'analyticsTracker');
      // ============ Mock Data ============
      jest.spyOn(WP, 'getEntriesByName').mockImplementation(name =>
        name === 'user_journey_mark.loaded_first_screen_first_journey'
          ? [
              {
                name: 'user_journey_mark.loaded_first_screen_first_journey',
                entryType: 'mark',
                duration: 0,
                startTime: 0,
                toJSON: jest.fn(),
              },
            ]
          : [],
      );
      jest.spyOn(WP, 'measure').mockImplementationOnce(() => ({
        name: 'user_journey_mark.loaded_first_screen_first_journey',
        entryType: 'mark',
        duration: 2000,
        startTime: 0,
        toJSON: jest.fn(),
        detail: '',
      }));

      // ========== Mock Data end ==========
      markJourney('loaded_first_screen_first_journey');
      // we wait for promises to flush since getting the launch time duration is async
      await Promise.resolve();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenLastCalledWith(
        'user_journey_mark.loaded_first_screen_first_journey',
      );
      expect(measureSpy).toHaveBeenCalledTimes(1);
      expect(analyticsTrackerSpy).toHaveBeenCalledTimes(1);
      expect(analyticsTrackerSpy).toHaveBeenLastCalledWith({
        metricName: 'load_first_screen_first_journey',
        rating: 'good',
        data: 2000,
        attribution: { category: 'user_journey_step' },
        navigationType: undefined,
        navigatorInformation: {
          deviceMemory: 0,
          hardwareConcurrency: 8,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });
  });
});
