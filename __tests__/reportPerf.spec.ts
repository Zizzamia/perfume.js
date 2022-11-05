/**
 * @jest-environment jsdom
 */
import { config } from '../src/config';
import { WN, WP } from '../src/constants';
import { visibility } from '../src/onVisibilityChange';
import { reportPerf } from '../src/reportPerf';
import mock from './_mock';

describe('reportPerf', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
  });

  describe('.reportPerf()', () => {
    it('should not call analyticsTracker() if isHidden is true', () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      visibility.isHidden = true;
      reportPerf('metricName', 123, 'good', {});
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call analyticsTracker() if analyticsTracker is defined', () => {
      visibility.isHidden = false;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('fcp', 123, 'good', {});
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'fcp',
        data: 123,
        attribution: {},
        navigatorInformation: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
        rating: 'good',
      });
    });

    it('should call analyticsTracker() with customProperties', () => {
      visibility.isHidden = false;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('tbt', 423, 'needsImprovement', { mare: 'sea' });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'tbt',
        data: 423,
        attribution: { mare: 'sea' },
        navigatorInformation: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
        rating: 'needsImprovement',
      });
    });
  });
});
