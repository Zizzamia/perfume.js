import Perfume from '../src/perfume';
import mock, { MockDateNowValue } from './_mock';

describe('Perfume', () => {
  let perfume: Perfume;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    mock.performance();
    (window as any).ga = undefined;
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (window as any).console.log = (n: any) => n;
    (window as any).console.warn = (n: any) => n;
    perfume['observers'].set('fcp', () => 400);
    perfume['observers'].set('fid', () => 400);
    perfume['queue'].pushTask = (cb: any) => cb();
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
      expect(instance.config).toEqual({
        firstContentfulPaint: false,
        firstPaint: false,
        firstInputDelay: false,
        browserTracker: false,
        googleAnalytics: {
          enable: false,
          timingVar: 'name',
        },
        logPrefix: 'Perfume.js:',
        logging: true,
        maxMeasureTime: 15000,
        warning: false,
        debugging: false,
      });
    });
  });

  describe('.observeFirstInputDelay', () => {
    (window as any).perfMetrics = mock.perfMetrics;
    (window as any).chrome = true;

    beforeEach(() => {
      perfume = new Perfume({
        firstPaint: false,
        firstContentfulPaint: false,
        firstInputDelay: true,
      });
      perfume['observers'].set('fid', () => 400);
      perfume['queue'].pushTask = (cb: any) => cb();
    });

    it('should be a promise', () => {
      const promise = perfume.observeFirstInputDelay;
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe('.start()', () => {
    beforeEach(() => {
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    });

    it('should throw a logWarn if metricName is not passed', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'Perfume.js:',
        'Please provide a metric name',
      );
    });

    it('should not throw a logWarn if param is correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call perf.mark', () => {
      spy = jest.spyOn((perfume as any).perf, 'mark');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('metricName', 'start');
    });

    it('should throw a logWarn if recording already started', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('metricName');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'Perfume.js:',
        'Recording already started.',
      );
    });
  });

  describe('.end()', () => {
    it('should throw a logWarn if param is not correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.end('');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'Perfume.js:',
        'Please provide a metric name',
      );
    });

    it('should throw a logWarn if param is correct and recording already stopped', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'Perfume.js:',
        'Recording already stopped.',
      );
    });

    it('should call log() with correct params', () => {
      spy = jest.spyOn(perfume, 'log');
      perfume.config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('metricName', 12346);
    });
  });

  describe('.start() and .end()', () => {
    it('should not throw a logWarn if param is correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call perf.mark() twice with the correct arguments', () => {
      spy = jest.spyOn((perfume as any).perf, 'mark');
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(2);
    });

    it('should call perf.measure() with the correct arguments', () => {
      spy = jest.spyOn((perfume as any).perf, 'measure');
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('metricName', {
        end: MockDateNowValue,
        start: MockDateNowValue,
      });
    });
  });

  describe('.endPaint()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should call end() after the first setTimeout', () => {
      spy = jest.spyOn(perfume, 'end');
      perfume.endPaint('test').catch(console.error);
      jest.runAllTimers();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.log()', () => {
    it('should not call window.console.log() if logging is disabled', () => {
      perfume.config.logging = false;
      spy = jest.spyOn(window.console, 'log');
      perfume.log('', 0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if logging is enabled', () => {
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      perfume.log('metricName', 1235);
      const text = '%c Perfume.js: metricName 1235.00 ms';
      const style = 'color: #ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style);
    });

    it('should call logWarn if params are not correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.log('', 0);
      const text = 'Please provide a metric name';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(perfume.config.logPrefix, text);
    });

    it('should not call window.console.log() if params are not correct', () => {
      spy = jest.spyOn(window.console, 'log');
      perfume.log('', 0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if params are correct', () => {
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      perfume.log('metricName', 1245);
      const text = '%c Perfume.js: metricName 1245.00 ms';
      const style = 'color: #ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style);
    });
  });

  describe('.logDebug()', () => {
    it('should not call window.console.log() if debugging is disabled', () => {
      perfume.config.debugging = false;
      spy = jest.spyOn(window.console, 'log');
      perfume.logDebug('', 0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if debugging is enabled', () => {
      perfume.config.debugging = true;
      spy = jest.spyOn(window.console, 'log');
      perfume.logDebug('metricName', 1235);
      const text = `Perfume.js debugging metricName:`;
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, 1235);
    });
  });

  describe('.sendTiming()', () => {
    it('should not call analyticsTracker() if isHidden is true', () => {
      perfume.config.analyticsTracker = (metricName, duration) => {
        // console.log(metricName, duration);
      };
      spy = jest.spyOn(perfume.config, 'analyticsTracker');
      perfume['isHidden'] = true;
      (perfume as any).sendTiming('metricName', 123);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call analyticsTracker() if analyticsTracker is defined', () => {
      perfume.config.analyticsTracker = (metricName, duration) => {
        // console.log(metricName, duration);
      };
      spy = jest.spyOn(perfume.config, 'analyticsTracker');
      (perfume as any).sendTiming('metricName', 123);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('metricName', 123, undefined);
    });

    it('should not call global.logWarn() if googleAnalytics is disable', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (perfume as any).sendTiming();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call global.logWarn() if googleAnalytics is disable with the correct arguments', () => {
      perfume.config.googleAnalytics.enable = true;
      spy = jest.spyOn(perfume as any, 'logWarn');
      (perfume as any).sendTiming();
      const text = 'Google Analytics has not been loaded';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(perfume.config.logPrefix, text);
    });

    it('should not call global.logWarn() if googleAnalytics is enable and ga is present', () => {
      perfume.config.googleAnalytics.enable = true;
      spy = jest.spyOn(perfume as any, 'logWarn');
      window.ga = () => true;
      (perfume as any).sendTiming('metricName', 123);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('.checkMetricName()', () => {
    it('should return "true" when provided a metric name', () => {
      const value = (perfume as any).checkMetricName('metricName');
      expect(value).toEqual(true);
    });

    it('should call logWarn when not provided a metric name', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (perfume as any).checkMetricName();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        perfume.config.logPrefix,
        'Please provide a metric name',
      );
    });

    it('should return "false" when not provided a metric name', () => {
      const value = (perfume as any).checkMetricName();
      expect(value).toEqual(false);
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

  describe('.firstContentfulPaintCb()', () => {
    beforeEach(() => {
      perfume.config.firstPaint = true;
      perfume.config.firstContentfulPaint = true;
    });

    it('should call logMetric() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'logMetric');
      (perfume as any).firstContentfulPaintCb(
        mock.entries,
        mock.Promise.resolve,
        mock.Promise.reject,
      );
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(1, 'First Paint', 'firstPaint');
      expect(spy).toHaveBeenCalledWith(
        1,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
    });

    it('should not call logMetric() when firstPaint and firstContentfulPaint is false', () => {
      perfume.config.firstPaint = false;
      perfume.config.firstContentfulPaint = false;
      spy = jest.spyOn(perfume as any, 'logMetric');
      (perfume as any).firstContentfulPaintCb(
        mock.entries,
        mock.Promise.resolve,
        mock.Promise.reject,
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('.initFirstPaint()', () => {
    beforeEach(() => {
      perfume.config.firstPaint = true;
      perfume.config.firstContentfulPaint = true;
    });

    it('should call firstContentfulPaint()', () => {
      spy = jest.spyOn(perfume['perf'], 'firstContentfulPaint');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstPaint']();
      expect(spy.mock.calls.length).toEqual(1);
      expect(perfume['perfEmulated']).not.toBeDefined();
    });

    it('should throw a logWarn if initFirstPaint fails', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (window as any).chrome = true;
      mock.PerformanceObserver.simulateErrorOnObserve = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstPaint']();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Perfume.js:', 'initFirstPaint failed');
      expect(perfume['perfEmulated']).not.toBeDefined();
    });

    it('should call firstContentfulPaint() with EmulatedPerformance', () => {
      delete (window as any).chrome;
      delete (window as any).PerformanceObserver;
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
      spy = jest.spyOn(perfume['perfEmulated'] as any, 'firstContentfulPaint');
      perfume['initFirstPaint']();
      expect(spy.mock.calls.length).toEqual(1);
      expect(perfume['perfEmulated']).toBeDefined();
    });

    it('should not call firstContentfulPaint() with EmulatedPerformance when perfEmulated is undefined', () => {
      delete (window as any).chrome;
      delete (window as any).PerformanceObserver;
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
      perfume['perfEmulated'] = undefined;
      perfume['initFirstPaint']();
      expect(perfume['perfEmulated']).not.toBeDefined();
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
      spy = jest.spyOn(perfume, 'log');
      (perfume as any).logMetric(
        1,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'First Contentful Paint',
        perfume.firstContentfulPaintDuration,
      );
    });

    it('should call sendTiming() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).logMetric(
        1,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'firstContentfulPaint',
        perfume.firstContentfulPaintDuration,
      );
    });

    it('should not call sendTiming() when duration is higher of config.maxMeasureTime', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).logMetric(
        20000,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should perfume.firstContentfulPaintDuration be equal to duration', () => {
      (perfume as any).logMetric(
        1,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
      expect(perfume.firstContentfulPaintDuration).toEqual(1);
    });

    it('should perfume.firstInputDelayDuration be equal to duration', () => {
      (perfume as any).logMetric(2, 'First Input Delay', 'firstInputDelay');
      expect(perfume.firstInputDelayDuration).toEqual(2);
    });
  });

  describe('.logWarn()', () => {
    it('should throw a console.warn if config.warning is true', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.config.warning = true;
      (perfume as any).logWarn('prefix', 'message');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('prefix', 'message');
    });

    it('should not throw a console.warn if config.warning is false', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.config.warning = false;
      (perfume as any).logWarn('prefix', 'message');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not throw a console.warn if config.logging is false', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.config.warning = true;
      perfume.config.logging = false;
      (perfume as any).logWarn('prefix', 'message');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
