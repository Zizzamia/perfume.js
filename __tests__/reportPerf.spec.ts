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
      reportPerf('metricName', 123);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call analyticsTracker() if analyticsTracker is defined', () => {
      visibility.isHidden = false;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('metricName', 123);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        data: 123,
        eventProperties: {},
        navigatorInformation: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });

    it('should call analyticsTracker() with customProperties', () => {
      visibility.isHidden = false;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('metricName', 123, { mare: 'sea' });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        data: 123,
        eventProperties: { mare: 'sea' },
        navigatorInformation: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });
  });
});
