/**
 * @jest-environment jsdom
 */
import { config } from '../src/config';
import { W, WN, WP } from '../src/constants';
import { visibility } from '../src/onVisibilityChange';
import { reportPerf } from '../src/reportPerf';
import mock from './_mock';

describe('reportPerf', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    visibility.isHidden = false;
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
  });

  describe('reportPerf()', () => {
    it('should not call analyticsTracker() if isHidden is true', () => {
      visibility.isHidden = true;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('FCP', 0.01, 'good', {});
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should not call analyticsTracker() if isHidden is true and measureName is CLS', () => {
      visibility.isHidden = true;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('CLS', 123, 'good', {});
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'CLS',
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

    it('should not call analyticsTracker() if isHidden is true and measureName is INP', () => {
      visibility.isHidden = true;
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('INP', 123, 'good', {});
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'INP',
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

    it('should call analyticsTracker() if analyticsTracker is defined', () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('FCP', 123, 'good', {});
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'FCP',
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
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');
      reportPerf('TBT', 423, 'needsImprovement', { mare: 'sea' });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'TBT',
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

    it('CLS and INP should be reported immediately without requestIdleCallback', () => {
      config.analyticsTracker = () => {};
      spy = jest.spyOn(config, 'analyticsTracker');

      // emulate requestIdleCallback delay
      const tasks: Function[] = [];
      (W as any).requestIdleCallback = (cb: Function) => tasks.push(cb);

      const immediatelyReportedMetrics = ['CLS', 'INP'];
      const delayedMetrics = ['TTFB', 'FCP', 'LCP', 'FID', 'TBT'];
      const defaultData = {
        data: 123,
        attribution: {},
        navigationType: undefined,
        navigatorInformation: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
        rating: 'good',
      };

      [...immediatelyReportedMetrics, ...delayedMetrics].forEach(metric => {
        reportPerf(metric, 123, 'good', {});
      });

      expect(spy.mock.calls).toEqual(
        immediatelyReportedMetrics.map(metric => [
          {
            metricName: metric,
            ...defaultData,
          },
        ]),
      );

      // run requestIdleCallback tasks
      tasks.forEach(task => task());

      expect(spy.mock.calls).toEqual(
        [...immediatelyReportedMetrics, ...delayedMetrics].map(metric => [
          {
            metricName: metric,
            ...defaultData,
          },
        ]),
      );
    });
  });
});
