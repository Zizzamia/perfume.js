import { config } from '../src/config';
import { visibility } from '../src/onVisibilityChange';
import { reportPerf } from '../src/reportPerf';

describe('reportPerf', () => {
  let spy: jest.SpyInstance;

  describe('.reportPerf()', () => {
    it('should not call analyticsTracker() if isHidden is true', () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      visibility.isHidden = true;
      reportPerf({ measureName: 'metricName', data: 123, navigatorInfo: {} });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call analyticsTracker() if analyticsTracker is defined', () => {
      visibility.isHidden = false;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf({ measureName: 'metricName', data: 123, navigatorInfo: {} });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        data: 123,
        eventProperties: {},
        navigatorInformation: {},
      });
    });

    it('should call analyticsTracker() with customProperties', () => {
      visibility.isHidden = false;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf({
        measureName: 'metricName',
        data: 123,
        navigatorInfo: {},
        customProperties: { mare: 'sea' },
      });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        data: 123,
        eventProperties: { mare: 'sea' },
        navigatorInformation: {},
      });
    });
  });
});
