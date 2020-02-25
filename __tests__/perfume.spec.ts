import Perfume from '../src/perfume';
import mock from './_mock';

describe('Perfume', () => {
  let perfume: Perfume;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    mock.navigator();
    mock.performance();
    perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    (window as any).ga = undefined;
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (window as any).console.log = (n: any) => n;
    (window as any).console.warn = (n: any) => n;
    perfume['perfObservers'] = {};
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('config', () => {
    const instance = new Perfume();

    it('should be defined', () => {
      expect(instance.config.dataConsumption).toEqual(false);
      expect(instance.config.resourceTiming).toEqual(false);
      expect(instance.config.analyticsTracker).toBeDefined();
      expect(instance.config.logPrefix).toEqual('Perfume.js:');
      expect(instance.config.logging).toEqual(true);
      expect(instance.config.maxMeasureTime).toEqual(15000);
    });
  });

  describe('constructor', () => {
    it('should run with config version A', () => {
      new Perfume({
        dataConsumption: true,
      });
    });

    it('should run with config version B', () => {
      new Perfume({
        dataConsumption: true,
        resourceTiming: true,
      });
    });

    it('should run with config version C', () => {
      new Perfume({
        dataConsumption: true,
        logging: false,
      });
    });
  });

  describe('.start()', () => {
    beforeEach(() => {
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn((perfume as any).wp, 'mark');
      perfume.start('metric_moon');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
    });

    it('should throw a logWarn if recording already started', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('metricName');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Recording already started.');
    });
  });

  describe('.end()', () => {
    it('should throw a logWarn if param is correct and recording already stopped', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Recording already stopped.');
    });

    it('should call log() with correct params', () => {
      spy = jest.spyOn(perfume as any, 'log');
      perfume.config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        measureName: 'metricName',
        data: 12346,
        duration: 12346,
        customProperties: {},
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported'
        },
      });
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn((perfume as any).wp, 'mark');
      perfume.start('metric_moon');
      perfume.end('metric_moon');
      expect(spy.mock.calls.length).toBe(2);
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_start');
      expect(spy).toHaveBeenCalledWith('mark_metric_moon_end');
    });

    it('should call sendTiming() with correct params', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      perfume.config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        measureName: 'metricName',
        data: 12346,
        duration: 12346,
        customProperties: {},
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported'
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

    it('should call clearMarks() twice and with the correct arguments', () => {
      spy = jest.spyOn((perfume as any).wp, 'clearMarks');
      perfume.clear('measure_moon');
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith('mark_measure_moon_start');
      expect(spy).toHaveBeenCalledWith('mark_measure_moon_end');
    });
  });

  describe('.log()', () => {
    it('should not call window.console.log() if logging is disabled', () => {
      perfume.config.logging = false;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({ metricName: '', data: '0 ms' });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if logging is enabled', () => {
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({
        measureName: 'metricName',
        data: '1235.00 ms',
        navigatorInfo: {},
      });
      const text = '%c Perfume.js: metricName ';
      const style = 'color:#ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style, '1235.00 ms', {});
    });

    it('should call window.console.log() if params are correct', () => {
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({
        measureName: 'metricName',
        data: '1245.00 ms',
        navigatorInfo: {},
      });
      const text = '%c Perfume.js: metricName ';
      const style = 'color:#ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style, '1245.00 ms', {});
    });

    it('should call window.console.log() with data', () => {
      const data = {};
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({
        measureName: 'metricName',
        data,
        navigatorInfo: {},
      });
      const text = '%c Perfume.js: metricName ';
      const style = 'color:#ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style, data, {});
    });
  });

  describe('.didVisibilityChange()', () => {
    it('should keep "hidden" default value when is false', () => {
      perfume['didVisibilityChange']();
      expect(perfume['isHidden']).toEqual(false);
    });

    it('should set "hidden" value when is true', () => {
      perfume['isHidden'] = false;
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      perfume['didVisibilityChange']();
      expect(perfume['isHidden']).toEqual(true);
    });

    it('should keep "hidden" value when changes to false', () => {
      perfume['isHidden'] = true;
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      perfume['didVisibilityChange']();
      expect(perfume['isHidden']).toEqual(true);
    });
  });

  describe('.performanceObserverCb()', () => {
    beforeEach(() => {
      (perfume as any).perfObservers.fcp = {
        disconnect: () => {},
      };
      (perfume as any).perfObservers.fid = {
        disconnect: () => {},
      };
    });

    it('should call logMetric() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'logMetric');
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
    it('should call performanceObserver()', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserver');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstPaint']();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.digestFirstInputDelayEntries()', () => {
    it('should call performanceObserver()', () => {
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
    it('should call performanceObserver()', () => {
      (perfume as any).performanceObserver = jest.fn();
      spy = jest.spyOn(perfume as any, 'performanceObserver');
      perfume['initFirstInputDelay']();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.disconnectDataConsumption()', () => {
    beforeEach(() => {
      (perfume as any).dataConsumptionTimeout = 12345;
    });

    it('should call logData() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'logData');
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
      spy = jest.spyOn(perfume as any, 'logMetric');
      (perfume as any).disconnectPerfObservers();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call logMetric() when observer and lcpDuration are defined', () => {
      spy = jest.spyOn(perfume as any, 'logMetric');
      (perfume as any).lcpDuration = 10;
      (perfume as any).perfObservers.lcp = { disconnect: jest.fn() };
      (perfume as any).disconnectPerfObservers();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        (perfume as any).lcpDuration,
        'largestContentfulPaint',
      );
    });

    it('should call logMetric() when observer and cumulativeLayoutShiftScore are defined', () => {
      spy = jest.spyOn(perfume as any, 'logMetric');
      (perfume as any).cumulativeLayoutShiftScore = 20;
      (perfume as any).perfObservers.cls = {
        disconnect: jest.fn(),
        takeRecords: jest.fn(),
      };
      (perfume as any).disconnectPerfObservers();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        (perfume as any).cumulativeLayoutShiftScore,
        'cumulativeLayoutShiftScore',
        '',
      );
    });
  });

  describe('.initLargestContentfulPaint()', () => {
    it('should call performanceObserver', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserver');
      (perfume as any).initLargestContentfulPaint();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.initLayoutShift()', () => {
    it('should call performanceObserver', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserver');
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
      (perfume as any).config.resourceTiming = true;
      spy = jest.spyOn(perfume as any, 'initResourceTiming');
      (perfume as any).initPerformanceObserver();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('.initResourceTiming()', () => {
    beforeEach(() => {
      perfume.config.dataConsumption = true;
      (perfume as any).perfObservers.dataConsumption = { disconnect: () => {} };
    });

    it('should call performanceObserver()', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserver');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initResourceTiming']();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should call disconnectDataConsumption() after the setTimeout', () => {
      jest.spyOn(perfume as any, 'performanceObserver');
      spy = jest.spyOn(perfume as any, 'disconnectDataConsumption');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initResourceTiming']();
      jest.runAllTimers();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('isLowEndDevice', () => {
    it('should return false as default option', () => {
      expect((perfume as any).isLowEndDevice).toEqual(false);
    });

    it('should return true when hardwareConcurrency is 4', () => {
      (perfume as any).wn.hardwareConcurrency = 4;
      expect((perfume as any).isLowEndDevice).toEqual(true);
    });

    it('should return true when deviceMemory is 4', () => {
      (perfume as any).wn.hardwareConcurrency = 8;
      (perfume as any).wn.deviceMemory = 4;
      expect((perfume as any).isLowEndDevice).toEqual(true);
    });
  });

  describe('isLowEndExperience', () => {
    it('should return false as default option', () => {
      expect((perfume as any).isLowEndExperience).toEqual(false);
    });

    it('should return true when isLowEndDevice is true', () => {
      (perfume as any).wn.hardwareConcurrency = 4;
      (perfume as any).wn.deviceMemory = 4;
      expect((perfume as any).isLowEndExperience).toEqual(true);
    });

    it('should return true when et is 3g', () => {
      (perfume as any).wn.hardwareConcurrency = 8;
      (perfume as any).wn.deviceMemory = 8;
      (perfume as any).et = '3g';
      expect((perfume as any).isLowEndExperience).toEqual(true);
    });

    it('should return true when et is 2g', () => {
      (perfume as any).et = '2g';
      expect((perfume as any).isLowEndExperience).toEqual(true);
    });

    it('should return true when et is slow-2g', () => {
      (perfume as any).et = 'slow-2g';
      expect((perfume as any).isLowEndExperience).toEqual(true);
    });

    it('should return true when saveData is true', () => {
      (perfume as any).sd = true;
      expect((perfume as any).isLowEndExperience).toEqual(true);
    });
  });

  describe('.onVisibilityChange()', () => {
    it('should not call document.addEventListener() when document.hidden is undefined', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(undefined as any);
      (perfume as any).onVisibilityChange();
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call document.addEventListener() with the correct argument', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      (perfume as any).onVisibilityChange();
      expect(spy.mock.calls.length).toEqual(1);
      expect(document.addEventListener).toHaveBeenLastCalledWith(
        'visibilitychange',
        perfume['didVisibilityChange'],
      );
    });
  });

  describe('.logMetric()', () => {
    it('should call log() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'log');
      (perfume as any).logMetric(1, 'firstContentfulPaint');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        data: '1 ms',
        measureName: 'firstContentfulPaint',
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported'
        },
      });
    });

    it('should call sendTiming() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).logMetric(1, 'firstContentfulPaint');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        duration: 1,
        measureName: 'firstContentfulPaint',
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported'
        },
      });
    });

    it('should not call sendTiming() when duration is higher of config.maxMeasureTime', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).logMetric(20000, 'firstContentfulPaint');
      expect(spy.mock.calls.length).toEqual(0);
    });
  });

  describe('.logWarn()', () => {
    it('should throw a console.warn if config.warning is true', () => {
      spy = jest.spyOn(window.console, 'warn');
      (perfume as any).logWarn('message');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(perfume.config.logPrefix, 'message');
    });

    it('should not throw a console.warn if config.logging is false', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.config.logging = false;
      (perfume as any).logWarn('message');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('.isPerformanceSupported()', () => {
    it('should return true if the browser supports the Navigation Timing API', () => {
      expect((perfume as any).isPerformanceSupported()).toEqual(true);
    });

    it('should return false if the browser does not supports performance.mark', () => {
      delete window.performance.mark;
      expect((perfume as any).isPerformanceSupported()).toEqual(false);
    });

    it('should return false if the browser does not supports performance.now', () => {
      window.performance.mark = () => 1;
      delete window.performance.now;
      expect((perfume as any).isPerformanceSupported()).toEqual(false);
    });
  });

  describe('.getNavigationTiming()', () => {
    it('when navigator is not supported should return an empty object', () => {
      delete (perfume as any).wn;
      expect((perfume as any).getNavigatorInfo()).toEqual({});
    });

    it('when navigator is supported should return the correct value', () => {
      mock.navigator();
      expect((perfume as any).getNavigatorInfo()).toEqual({
        deviceMemory: 8,
        hardwareConcurrency: 12,
        serviceWorkerStatus: 'unsupported'
      });
    });
  });

  describe('.getNavigationTiming()', () => {
    it('when performance is not supported should return an empty object', () => {
      delete window.performance.mark;
      expect((perfume as any).getNavigationTiming()).toEqual({});
    });

    it('when performance is supported should return the correct value', () => {
      expect((perfume as any).getNavigationTiming()).toEqual({
        dnsLookupTime: 0,
        downloadTime: 0.6899998988956213,
        fetchTime: 4.435000009834766,
        headerSize: 0,
        timeToFirstByte: 3.745000110939145,
        totalTime: 4.435000009834766,
        workerTime: 4.435000009834766,
      });
    });

    it('when workerStart is 0 should return 0', () => {
      jest.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
        {
          workerTime: 0,
        },
      ] as any);
      expect((perfume as any).getNavigationTiming().workerTime).toEqual(0);
    });

    it('when Navigation Timing is not supported yet should return an empty object', () => {
      jest
        .spyOn(window.performance, 'getEntriesByType')
        .mockReturnValue([] as any);
      expect((perfume as any).getNavigationTiming()).toEqual({});
    });
  });

  describe('.getNetworkInformation()', () => {
    it('when connection is not supported should return an empty object', () => {
      delete (perfume as any).wn.connection;
      expect((perfume as any).getNetworkInformation()).toEqual({});
    });

    it('when connection is not supported should return an empty object', () => {
      mock.navigator();
      (perfume as any).wn.connection = undefined;
      expect((perfume as any).getNetworkInformation()).toEqual({});
    });

    it('when connection is supported should return the correct value', () => {
      mock.navigator();
      expect((perfume as any).getNetworkInformation()).toEqual({
        effectiveType: '4g',
        rtt: 50,
        downlink: 2.3,
        saveData: false,
      });
    });
  });

  describe('.performanceMeasure()', () => {
    it('should call window.performance.measure with the correct arguments', () => {
      spy = jest.spyOn((perfume as any).wp, 'measure');
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

  describe('.performanceObserver()', () => {
    it('should call PerformanceObserver', () => {
      spy = jest.spyOn(window, 'PerformanceObserver' as any);
      (perfume as any).performanceObserver('paint', () => 0);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.getDurationByMetric()', () => {
    it('should return entry.duration when entryType is not measure', () => {
      window.performance.getEntriesByName = () =>
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
        resourceTiming: true,
      });
    });

    beforeEach(() => {
      (perfume as any).perfResourceTiming = {
        css: 0,
        fetch: 0,
        total: 0,
      };
      perfume.config.dataConsumption = true;
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
      spy = jest.spyOn(perfume as any, 'logData');
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

  describe('.pushTask()', () => {
    it('should call cb() if requestIdleCallback is undefined', () => {
      spy = jest.fn();
      perfume['pushTask'](spy);
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should call requestIdleCallback if is defined', () => {
      spy = jest.fn();
      (window as any).requestIdleCallback = spy;
      perfume['pushTask'](() => {});
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.sendTiming()', () => {
    it('should not call analyticsTracker() if isHidden is true', () => {
      perfume.config.analyticsTracker = () => {};
      spy = jest.spyOn(perfume.config, 'analyticsTracker');
      perfume['isHidden'] = true;
      (perfume as any).sendTiming({ measureName: 'metricName', duration: 123 });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call analyticsTracker() if analyticsTracker is defined', () => {
      perfume.config.analyticsTracker = () => {};
      spy = jest.spyOn(perfume.config, 'analyticsTracker');
      (perfume as any).sendTiming({ measureName: 'metricName', duration: 123 });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        data: undefined,
        duration: 123,
        eventProperties: {},
      });
    });
  });
});
