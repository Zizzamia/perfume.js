import { C, WN, WP } from '../src/constants';
import * as log from '../src/log';
import { metrics } from '../src/metrics';
import { visibility } from '../src/onVisibilityChange';
import Perfume from '../src/perfume';
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
      new Perfume({});
    });

    it('should run with config version B', () => {
      new Perfume({
        resourceTiming: true,
      });
    });

    it('should run with config version C', () => {
      new Perfume({
        elementTiming: true,
      });
    });

    it('should run with config version D', () => {
      new Perfume({
        resourceTiming: true,
        elementTiming: true,
      });
    });

    it('when navigator is not supported should not call WN.storage.estimate()', () => {
      (WN as any) = mock.navigator();
      const spy = jest.spyOn(WN.storage, 'estimate');
      (WN as any).storage = undefined;
      new Perfume();
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('when navigator is supported should call WN.storage.estimate()', () => {
      (WN as any) = mock.navigator();
      const spy = jest.spyOn(WN.storage, 'estimate');
      new Perfume();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should not call document.addEventListener() when document.hidden is undefined', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(undefined as any);
      new Perfume();
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call document.addEventListener() with the correct argument', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      new Perfume();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.start()', () => {
    beforeEach(() => {
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
      delete metrics.metric_moon;
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn(WP, 'mark');
      perfume.start('metric_moon');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
    });
  });

  describe('.end()', () => {
    beforeEach(() => {
      delete metrics.metric_moon;
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn(WP, 'mark');
      perfume.start('metric_moon');
      perfume.end('metric_moon');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_end');
    });

    it('should call logData() with correct params', () => {
      spy = jest.spyOn(log, 'logData');
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'metricName',
        12346,
        {},
      );
    });

    it('should add metrics properly', () => {
      perfume = new Perfume();
      perfume.start('metricName');
      expect(metrics['metricName']).toBeDefined();
    });

    it('should delete metrics properly', () => {
      perfume = new Perfume();
      perfume.start('metricName');
      perfume.end('metricName');
      expect(metrics['metricName']).not.toBeDefined();
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
