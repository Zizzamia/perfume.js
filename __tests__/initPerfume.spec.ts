/**
 * @jest-environment jsdom
 */
import { C, WN, WP } from '../src/constants';
import { initPerfume } from '../src/initPerfume';
import * as observe from '../src/observe';
import { visibility } from '../src/onVisibilityChange';
import { IThresholdTier } from '../src/types';
import { config } from '../src/config';
import { testConfig } from './stepsTestConstants';
import mock from './_mock';
import { isPerformanceSupported } from '../src/isSupported';

jest.mock('../src/isSupported', () => ({
  isPerformanceSupported: jest.fn(),
}));

describe('Perfume', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
    initPerfume({ ...mock.defaultPerfumeConfig });
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (C as any).log = (n: any) => n;
    (window as any).console.warn = (n: any) => n;
    (observe as any).perfObservers = {};
    visibility.isHidden = false;
    (isPerformanceSupported as jest.Mock).mockImplementation(() => true);
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('constructor', () => {
    it('should run with config version A', () => {
      initPerfume({});
    });

    it('should run with config version B', () => {
      initPerfume({
        resourceTiming: true,
      });
    });

    it('should run with config version C', () => {
      initPerfume({
        elementTiming: true,
      });
    });

    it('should run with config version D', () => {
      initPerfume({
        resourceTiming: true,
        elementTiming: true,
      });
    });

    it('should run with steps config version B', () => {
      initPerfume({
        steps: {
          load_first_screen_first_journey: {
            threshold: IThresholdTier.unavoidable,
            marks: ['launch', 'loaded_first_screen_first_journey'],
          },
          load_second_screen_first_journey: {
            threshold: IThresholdTier.instant,
            marks: [
              'start_navigate_to_second_screen_first_journey',
              'loaded_second_screen_first_journey',
            ],
          },
        },
      });
    });

    it('should run with steps config version D', () => {
      initPerfume({
        onMarkStep: () => {},
      });
    });

    it('should run with steps config version E', () => {
      initPerfume({
        steps: {
          load_first_screen_first_journey: {
            threshold: IThresholdTier.unavoidable,
            marks: ['launch', 'loaded_first_screen_first_journey'],
          },
          load_second_screen_first_journey: {
            threshold: IThresholdTier.instant,
            marks: [
              'start_navigate_to_second_screen_first_journey',
              'loaded_second_screen_first_journey',
            ],
          },
        },
      });
    });

    it('should run with all userJourney config', () => {
      expect(config).not.toMatchObject(testConfig);
      initPerfume(testConfig);
      expect(config).toMatchObject(testConfig);
    });

    it('when navigator is not supported should not call WN.storage.estimate()', () => {
      (WN as any) = mock.navigator();
      const spy = jest.spyOn(WN.storage, 'estimate');
      (WN as any).storage = undefined;
      initPerfume();
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('when WN.storage.estimate() is not defined should not call it', () => {
      (WN as any) = mock.navigator();
      const spy = jest.spyOn(WN.storage, 'estimate');
      (WN as any).storage.estimate = undefined;
      expect(() => initPerfume()).not.toThrow(TypeError);
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('when navigator is supported should call WN.storage.estimate()', () => {
      (WN as any) = mock.navigator();
      const spy = jest.spyOn(WN.storage, 'estimate');
      initPerfume();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should not initiate if isPerformanceSupported is false', () => {
      (isPerformanceSupported as jest.Mock).mockImplementation(() => false);
      const initPerformanceObserverSpy = jest.spyOn(
        observe,
        'initPerformanceObserver',
      );
      initPerfume(testConfig);
      expect(initPerformanceObserverSpy).not.toHaveBeenCalled();
    });
  });
});
