/**
 * @jest-environment jsdom
 */
import { C, WN, WP } from '../../src/constants';
import { initPerfume } from '../../src/perfume';
import * as log from '../../src/log';
import { metrics } from '../../src/metrics';
import * as observe from '../../src/observe';
import { visibility } from '../../src/onVisibilityChange';
import { clear, end, start } from '../../src/steps/markStep';
import mock from './../_mock';

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
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('start()', () => {
    beforeEach(() => {
      initPerfume({ ...mock.defaultPerfumeConfig });
      delete metrics.metric_moon;
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn(WP, 'mark');
      start('metric_moon');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
    });
  });

  describe('end()', () => {
    beforeEach(() => {
      delete metrics.metric_moon;
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn(WP, 'mark');
      start('metric_moon');
      end('metric_moon');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_end');
    });

    it('should call logData() with correct params', () => {
      spy = jest.spyOn(log, 'logData');
      start('metricName');
      end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('metricName', 12346, {});
    });

    it('should add metrics properly', () => {
      initPerfume();
      start('metricName');
      expect(metrics['metricName']).toBeDefined();
    });

    it('should delete metrics properly', () => {
      initPerfume();
      start('metricName');
      end('metricName');
      expect(metrics['metricName']).not.toBeDefined();
    });
  });

  describe('clear()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should not call clearMarks() when not supported', () => {
      spy = jest.spyOn(WP, 'clearMarks');
      delete (WP as any).clearMarks;
      clear('measure_moon');
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call clearMarks() twice and with the correct arguments', () => {
      spy = jest.spyOn(WP, 'clearMarks');
      clear('measure_moon');
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith('mark_measure_moon_start');
      expect(spy).toHaveBeenCalledWith('mark_measure_moon_end');
    });
  });
});