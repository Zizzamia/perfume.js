/**
 * @jest-environment jsdom
 */
import { C, WN, WP } from '../src/constants';
import * as log from '../src/log';
import * as reportPerf from '../src/reportPerf';
import * as totalBlockingTime from '../src/totalBlockingTime';
import * as utils from '../src/utils';
import mock from './_mock';
import * as onVisibilityChange from '../src/onVisibilityChange';

jest.mock('../src/onVisibilityChange', () => {
  const originalModule = jest.requireActual('../src/onVisibilityChange');
  return {
    ...originalModule,
    visibility: {
      isHidden: false,
      didChange: false,
    },
  };
});

describe('log', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
    (C as any).log = (n: any) => n;
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
      jest.resetAllMocks();
    }
  });

  describe('.logData()', () => {
    it('should call pushTask', () => {
      spy = jest.spyOn(utils, 'pushTask');
      log.logData('measureName', {});
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.logMetric()', () => {
    it('should call reportPerf() when value is 0', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric({
        attribution: {},
        name: 'CLS',
        rating: 'good',
        value: 0,
        navigationType: 'navigate',
      });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('CLS', 0, 'good', {}, 'navigate');
    });

    it('should call reportPerf() with the correct arguments', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric({
        attribution: {},
        name: 'FCP',
        rating: 'good',
        value: 1,
        navigationType: 'navigate',
      });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('FCP', 1, 'good', {}, 'navigate');
    });

    it('should not call reportPerf() when duration is higher of config.maxTime', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric({
        attribution: {},
        name: 'FCP',
        rating: 'good',
        value: 40000,
      });
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call initTotalBlockingTime only once', () => {
      const tbtSpy = jest.spyOn(totalBlockingTime, 'initTotalBlockingTime');

      (window as any).PerformanceObserver = mock.PerformanceObserver;

      // FCP and LCP both trigger TBT measurement
      log.logMetric({
        attribution: {},
        name: 'FCP',
        rating: 'good',
        value: 1,
        navigationType: 'navigate',
      });
      log.logMetric({
        attribution: {},
        name: 'LCP',
        rating: 'good',
        value: 1,
        navigationType: 'navigate',
      });

      expect(tbtSpy.mock.calls.length).toEqual(1);
      expect(tbtSpy).toHaveBeenCalledWith([
        { name: 'first-paint', startTime: 1 },
        { name: 'first-contentful-paint', startTime: 1 },
        { duration: 4, name: 'mousedown' },
      ]);
    });

    it('should call logData with FID metrics', () => {
      jest.useFakeTimers();
      const logDataSpy = jest.spyOn(log, 'logData');
      log.logMetric({
        attribution: {},
        name: 'FID',
        rating: 'good',
        value: 0,
        navigationType: 'navigate',
      });
      jest.advanceTimersByTime(10000);
      expect(logDataSpy.mock.calls.length).toEqual(1);
      expect(logDataSpy).toHaveBeenCalledWith('dataConsumption', {
        beacon: 0,
        css: 0,
        fetch: 0,
        img: 0,
        other: 0,
        script: 0,
        total: 0,
        xmlhttprequest: 0,
      });
    });

    it('should not call logData with FID metrics if visibility did change', () => {
      jest.useFakeTimers();
      const logDataSpy = jest.spyOn(log, 'logData');
      onVisibilityChange.visibility.didChange = true;
      log.logMetric({
        attribution: {},
        name: 'FID',
        rating: 'good',
        value: 0,
        navigationType: 'navigate',
      });
      jest.advanceTimersByTime(10000);
      expect(logDataSpy.mock.calls.length).toEqual(0);
    });
  });
});
