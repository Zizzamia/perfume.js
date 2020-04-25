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
    perfume['perfObservers'] = {};
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

  describe('.performanceObserverCb()', () => {
    beforeEach(() => {
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      (perfume as any).perfObservers.fcp = {
        disconnect: () => {},
      };
      (perfume as any).perfObservers.fid = {
        disconnect: () => {},
      };
    });

    it('should call logMetric() with the correct arguments', () => {
      spy = jest.spyOn(log, 'logMetric');
      (perfume as any).performanceObserverCb({
        performanceEntries: mock.entries,
        entryName: 'first-paint',
        measureName: 'firstPaint',
        valueLog: 'startTime',
      });
      (perfume as any).performanceObserverCb({
        performanceEntries: mock.entries,
        entryName: 'first-contentful-paint',
        measureName: 'firstContentfulPaint',
        valueLog: 'startTime',
      });
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(1, 'firstPaint');
      expect(spy).toHaveBeenCalledWith(1, 'firstContentfulPaint');
    });

    it('should call disconnect() for firstInputDelay when measureName is firstInputDelay', () => {
      spy = jest.spyOn((perfume as any).perfObservers.fid, 'disconnect');
      (perfume as any).performanceObserverCb({
        performanceEntries: [],
        measureName: 'firstInputDelay',
        valueLog: 'duration',
      });
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should not call disconnect() for firstInputDelay when measureName is not firstInputDelay', () => {
      spy = jest.spyOn((perfume as any).perfObservers.fid, 'disconnect');
      (perfume as any).performanceObserverCb({
        performanceEntries: [],
        measureName: 'firstInputDelay',
        valueLog: 'duration',
      });
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.initFirstPaint()', () => {
    it('should call po()', () => {
      spy = jest.spyOn(observe, 'po');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstPaint']();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.digestFirstInputDelayEntries()', () => {
    it('should call po()', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserverCb');
      perfume['digestFirstInputDelayEntries']([]);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        performanceEntries: [],
        measureName: 'firstInputDelay',
        valueLog: 'duration',
      });
    });

    it('should call disconnectDataConsumption()', () => {
      spy = jest.spyOn(perfume as any, 'disconnectDataConsumption');
      perfume['digestFirstInputDelayEntries']([]);
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.initFirstInputDelay()', () => {
    it('should call po()', () => {
      spy = jest.spyOn(observe, 'po');
      perfume['initFirstInputDelay']();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.disconnectDataConsumption()', () => {
    beforeEach(() => {
      (perfume as any).dataConsumptionTimeout = 12345;
    });

    it('should call logData() with the correct arguments', () => {
      spy = jest.spyOn(log, 'logData');
      (perfume as any).disconnectDataConsumption();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'dataConsumption',
        (perfume as any).perfResourceTiming,
      );
    });
  });

  describe('.disconnectPerfObservers()', () => {
    it('should not call logMetric() as default', () => {
      spy = jest.spyOn(log, 'logMetric');
      (perfume as any).disconnectPerfObservers();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call logMetric() when observer and lcp are defined', () => {
      spy = jest.spyOn(log, 'logMetric');
      (perfume as any).perfObservers.lcp = { disconnect: jest.fn() };
      (perfume as any).disconnectPerfObservers(10);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(10, 'largestContentfulPaint');
    });

    it('should call logMetric() when observer and clsScore are defined', () => {
      spy = jest.spyOn(log, 'logMetric');
      (perfume as any).perfObservers.cls = {
        disconnect: jest.fn(),
        takeRecords: jest.fn(),
      };
      (perfume as any).disconnectPerfObservers(10, 20);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(20, 'cumulativeLayoutShift', '');
    });
  });

  describe('.initLargestContentfulPaint()', () => {
    it('should call po', () => {
      spy = jest.spyOn(observe, 'po');
      (perfume as any).initLargestContentfulPaint();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.initLayoutShift()', () => {
    it('should call performanceObserver', () => {
      spy = jest.spyOn(observe, 'po');
      (perfume as any).initLayoutShift();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.initPerformanceObserver()', () => {
    beforeEach(() => {
      (perfume as any).initFirstPaint = jest.fn();
      (perfume as any).initFirstInputDelay = jest.fn();
      (perfume as any).initLargestContentfulPaint = jest.fn();
      (perfume as any).initResourceTiming = jest.fn();
    });

    it('should call initFirstPaint with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'initFirstPaint');
      (perfume as any).initPerformanceObserver();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith();
    });

    it('should call initFirstInputDelay with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'initFirstInputDelay');
      (perfume as any).initPerformanceObserver();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith();
    });

    it('should call initLargestContentfulPaint with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'initLargestContentfulPaint');
      (perfume as any).initPerformanceObserver();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith();
    });

    it('should not call initResourceTiming', () => {
      spy = jest.spyOn(perfume as any, 'initResourceTiming');
      (perfume as any).initPerformanceObserver();
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call initResourceTiming when resourceTiming or is true', () => {
      config.resourceTiming = true;
      spy = jest.spyOn(perfume as any, 'initResourceTiming');
      (perfume as any).initPerformanceObserver();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('.initResourceTiming()', () => {
    beforeEach(() => {
      config.resourceTiming = true;
      (perfume as any).perfObservers.dataConsumption = { disconnect: () => {} };
    });

    it('should call po()', () => {
      spy = jest.spyOn(observe, 'po');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initResourceTiming']();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should call disconnectDataConsumption() after the setTimeout', () => {
      jest.spyOn(observe, 'po');
      spy = jest.spyOn(perfume as any, 'disconnectDataConsumption');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initResourceTiming']();
      jest.runAllTimers();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.performanceMeasure()', () => {
    it('should call window.performance.measure with the correct arguments', () => {
      spy = jest.spyOn(WP, 'measure');
      (perfume as any).performanceMeasure('fibonacci');
      const start = 'mark_fibonacci_start';
      const end = 'mark_fibonacci_end';
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci', start, end);
    });

    it('should call getDurationByMetric with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'getDurationByMetric');
      (perfume as any).performanceMeasure('fibonacci', {});
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci');
    });
  });

  describe('.getDurationByMetric()', () => {
    it('should return entry.duration when entryType is not measure', () => {
      WP.getEntriesByName = () =>
        [{ duration: 12345, entryType: 'notMeasure' } as any] as any[];
      const value = (perfume as any).getDurationByMetric('metricName');
      expect(value).toEqual(-1);
    });

    it('should return -1 when entryType is a measure', () => {
      const value = (perfume as any).getDurationByMetric('metricName');
      expect(value).toEqual(12346);
    });
  });

  describe('.performanceObserverResourceCb()', () => {
    beforeEach(() => {
      perfume = new Perfume({
        ...mock.defaultPerfumeConfig,
      });
    });

    beforeEach(() => {
      (perfume as any).perfResourceTiming = {
        css: 0,
        fetch: 0,
        total: 0,
      };
      config.resourceTiming = true;
      (perfume as any).perfObservers.dataConsumption = { disconnect: () => {} };
    });

    it('should dataConsumption be 0 when entries are empty', () => {
      (perfume as any).performanceObserverResourceCb({
        performanceEntries: [],
      });
      expect((perfume as any).perfResourceTiming).toEqual({
        css: 0,
        fetch: 0,
        total: 0,
      });
    });

    it('should float the dataConsumption result', () => {
      (perfume as any).performanceObserverResourceCb({
        performanceEntries: [
          {
            decodedBodySize: 12345678,
            initiatorType: 'css',
          },
        ],
      });
      expect((perfume as any).perfResourceTiming).toEqual({
        css: 12345.678,
        fetch: 0,
        total: 12345.678,
      });
    });

    it('should sum the dataConsumption result', () => {
      (perfume as any).performanceObserverResourceCb({
        performanceEntries: [
          {
            decodedBodySize: 12345678,
            initiatorType: 'css',
          },
          {
            decodedBodySize: 10000678,
            initiatorType: 'fetch',
          },
        ],
      });
      expect((perfume as any).perfResourceTiming).toEqual({
        css: 12345.678,
        fetch: 10000.678,
        total: 22346.356,
      });
    });

    it('should call logData for each performanceEntry', () => {
      spy = jest.spyOn(log, 'logData');
      (perfume as any).performanceObserverResourceCb({
        performanceEntries: [
          {
            decodedBodySize: 12345678,
            initiatorType: 'css',
          },
          {
            decodedBodySize: 10000678,
            initiatorType: 'fetch',
          },
        ],
      });
      expect(spy.mock.calls.length).toEqual(2);
    });
  });
});
