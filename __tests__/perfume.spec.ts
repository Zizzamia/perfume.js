import { config } from '../src/config';
import { C, WN, WP } from '../src/constants';
import * as log from '../src/log';
import { visibility } from '../src/onVisibilityChange';
import Perfume from '../src/perfume';
import * as reportPerf from '../src/reportPerf';
import * as observe from '../src/observe';
import mock from './_mock';

describe('Perfume', () => {
  let perfume: Perfume;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
    perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (C as any).log = (n: any) => n;
    (window as any).console.warn = (n: any) => n;
    (observe as any).perfObservers = {};
    visibility.isHidden = false;
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('constructor', () => {
    it('should run with config version A', () => {
      new Perfume({
        resourceTiming: true,
      });
    });

    it('should run with config version B', () => {
      new Perfume({
        resourceTiming: true,
        logging: false,
      });
    });
  });

  describe('.start()', () => {
    beforeEach(() => {
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn(WP, 'mark');
      perfume.start('metric_moon');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
    });

    it('should throw a logWarn if recording already started', () => {
      spy = jest.spyOn(log, 'logWarn');
      perfume.start('metricName');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Recording already started.');
    });
  });

  describe('.end()', () => {
    it('should throw a logWarn if param is correct and recording already stopped', () => {
      spy = jest.spyOn(log, 'logWarn');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Recording already stopped.');
    });

    it('should call log() with correct params', () => {
      spy = jest.spyOn(log, 'log');
      config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        measureName: 'metricName',
        data: 12346,
        customProperties: {},
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn(WP, 'mark');
      perfume.start('metric_moon');
      perfume.end('metric_moon');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_end');
    });

    it('should call reportPerf() with correct params', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        measureName: 'metricName',
        data: 12346,
        customProperties: {},
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });

    it('should add metrics properly', () => {
      perfume = new Perfume();
      perfume.start('metricName');
      expect(perfume['metrics']['metricName']).toBeDefined();
    });

    it('should delete metrics properly', () => {
      perfume = new Perfume();
      perfume.start('metricName');
      perfume.end('metricName');
      expect(perfume['metrics']['metricName']).not.toBeDefined();
    });
  });

  describe('.endPaint()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should call end() after the first setTimeout', () => {
      spy = jest.spyOn(perfume, 'end');
      perfume.endPaint('test');
      jest.runAllTimers();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.clear()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should not call clearMarks() when not supported', () => {
      spy = jest.spyOn(WP, 'clearMarks');
      delete (WP as any).clearMarks;
      perfume.clear('measure_moon');
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call clearMarks() twice and with the correct arguments', () => {
      spy = jest.spyOn(WP, 'clearMarks');
      perfume.clear('measure_moon');
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith('mark_measure_moon_start');
      expect(spy).toHaveBeenCalledWith('mark_measure_moon_end');
    });
  });
});
