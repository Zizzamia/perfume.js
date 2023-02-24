/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '../_mock';
import Perfume from '../../src/perfume';
import { markStep } from '../../src/steps/markStep';
import { config } from '../../src/config';

import { testConfig } from '../stepsTestConstants';

describe('measureStep', () => {
  let spy: jest.SpyInstance;
  let analyticsTrackerSpy: jest.SpyInstance;
  let measureSpy: jest.SpyInstance;

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

  describe('when two marks are not part of the same step', () => {
    it('should not run analyticsTracker', () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(WP, 'mark');
      analyticsTrackerSpy = jest.spyOn(config, 'analyticsTracker');
      markStep('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(
        'mark.start_navigate_to_second_screen_first_journey',
      );
      markStep('start_navigate_to_third_screen_first_journey');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenLastCalledWith(
        'mark.start_navigate_to_third_screen_first_journey',
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
      markStep('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(
        'mark.start_navigate_to_second_screen_first_journey',
      );
      // ============ Mock Data ============
      jest.spyOn(WP, 'getEntriesByName').mockImplementationOnce(name => {
        const entries: Record<string, PerformanceEntry> = {
          'mark.start_navigate_to_second_screen_first_journey': {
            name: 'mark.start_navigate_to_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 0,
            toJSON: jest.fn(),
          },
        };
        return [entries[name]] ?? [];
      });
      jest.spyOn(WP, 'measure').mockImplementationOnce(() => ({
        name: 'mark.start_navigate_to_second_screen_first_journey',
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
          'mark.start_navigate_to_second_screen_first_journey': {
            name: 'mark.start_navigate_to_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 0,
            toJSON: jest.fn(),
          },
          'mark.loaded_second_screen_first_journey': {
            name: 'mark.loaded_second_screen_first_journey',
            entryType: 'mark',
            duration: 0,
            startTime: 100,
            toJSON: jest.fn(),
          },
        };
        return [entries[name]] ?? [];
      });
      // ========== Mock Data end ==========
      markStep('loaded_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenLastCalledWith(
        'mark.loaded_second_screen_first_journey',
      );
      expect(measureSpy).toHaveBeenCalledTimes(2);
      expect(measureSpy).toHaveBeenCalledWith(
        'step.load_second_screen_first_journey',
        'mark.start_navigate_to_second_screen_first_journey',
        'mark.loaded_second_screen_first_journey',
      );
      expect(measureSpy).toHaveBeenLastCalledWith(
        'step.load_second_screen_first_journey_vitals_good',
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
        attribution: { category: 'step' },
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
  });
});
