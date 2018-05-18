import Perfume from '../src/perfume';
import mock from './_mock';

describe('Perfume', () => {
  let perfume: Perfume;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    (perfume as any).perf.ttiPolyfill = mock.ttiPolyfill;
    mock.performance();
    (window as any).ga = undefined;
    (window as any).PerformanceLongTaskTiming = mock.PerformanceLongTaskTiming;
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (window as any).console.log = (n: any) => n;
    (window as any).console.warn = (n: any) => n;
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
        timeToInteractive: false,
        analyticsLogger: undefined,
        googleAnalytics: {
          enable: false,
          timingVar: 'name'
        },
        logPrefix: '⚡️ Perfume.js:',
        logging: true,
        warning: false
      });
    });
  });

  describe('.observeTimeToInteractive()', () => {
    const instance = new Perfume({ timeToInteractive: true });
    (instance as any).perf.timeToInteractive = mock.timeToInteractive;
    (window as any).chrome = true;

    it('should be a promise', () => {
      const promise = instance.observeTimeToInteractive();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should resolve tti on chrome', done => {
      instance.observeTimeToInteractive().then(time => {
        expect(typeof time).toBe('number');
        done();
      });
    });
  });

  describe('.start()', () => {
    it('should throw a logWarn if metricName is not passed', () => {
      spy = jest.spyOn(perfume, 'logWarn');
      perfume.start('');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('⚡️ Perfume.js:', 'Please provide a metric name');
    });

    it('should not throw a logWarn if param is correct', () => {
      spy = jest.spyOn(perfume, 'logWarn');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw a logWarn if recording already started', () => {
      spy = jest.spyOn(perfume, 'logWarn');
      perfume.start('metricName');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('⚡️ Perfume.js:', 'Recording already started.');
    });
  });

  describe('.end()', () => {
    it('should throw a logWarn if param is not correct', () => {
      spy = jest.spyOn(perfume, 'logWarn');
      perfume.end('');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('⚡️ Perfume.js:', 'Please provide a metric name');
    });

    it('should throw a logWarn if param is correct and recording already stopped', () => {
      spy = jest.spyOn(perfume, 'logWarn');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('⚡️ Perfume.js:', 'Recording already stopped.');
    });

    it('should call log() when logging is true', () => {
      spy = jest.spyOn(perfume, 'log');
      perfume.config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('metricName', 12346);
    });

    it('should not call log() when logging is false', () => {
      spy = jest.spyOn(perfume, 'log');
      perfume.config.logging = false;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('.start() and .end()', () => {
    it('should not throw a logWarn if param is correct', () => {
      spy = jest.spyOn(perfume, 'logWarn');
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
      expect(spy).toHaveBeenCalledWith('metricName', {});
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
    it('should call logWarn if params are not correct', () => {
      spy = jest.spyOn(perfume, 'logWarn');
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
      spy = jest.spyOn(window.console, 'log');
      perfume.log('metricName', 12345);
      const text = '%c ⚡️ Perfume.js: metricName 12345.00 ms';
      const style = 'color: #ff6d00;font-size:12px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style);
    });
  });

  describe('.checkMetricName()', () => {
    it('should return "true" when provided a metric name', () => {
      const value = (perfume as any).checkMetricName('metricName');
      expect(value).toEqual(true);
    });

    it('should call logWarn when not provided a metric name', () => {
      spy = jest.spyOn(perfume, 'logWarn');
      (perfume as any).checkMetricName();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(perfume.config.logPrefix, 'Please provide a metric name');
    });

    it('should return "false" when not provided a metric name', () => {
      const value = (perfume as any).checkMetricName();
      expect(value).toEqual(false);
    });
  });

  describe('.firstContentfulPaintCb()', () => {
    beforeEach(() => {
      // spyOn(perfume.perf, 'timeToInteractive').and.callThrough();
    });

    it('should call logFCP() with the correct arguments', () => {
      perfume.config.firstPaint = true;
      perfume.config.firstContentfulPaint = true;
      perfume.config.timeToInteractive = true;
      spy = jest.spyOn(perfume as any, 'logFCP');
      (perfume as any).firstContentfulPaintCb(
        mock.entries,
        mock.Promise.resolve,
        mock.Promise.reject
      );
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(1, 'First Paint', 'firstPaint');
      expect(spy).toHaveBeenCalledWith(1, 'First Contentful Paint', 'firstContentfulPaint');
    });

    it('should not call logFCP() when firstPaint and firstContentfulPaint is false', () => {
      perfume.config.firstPaint = false;
      perfume.config.firstContentfulPaint = false;
      spy = jest.spyOn(perfume as any, 'logFCP');
      (perfume as any).firstContentfulPaintCb(
        mock.entries,
        mock.Promise.resolve,
        mock.Promise.reject
      );
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call timeToInteractive()', () => {
      perfume.config.timeToInteractive = true;
      spy = jest.spyOn((perfume as any).perf, 'timeToInteractive');
      (perfume as any).firstContentfulPaintCb(
        mock.entries,
        mock.Promise.resolve,
        mock.Promise.reject
      );
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.timeToInteractiveCb()', () => {
    it('should call log() with the correct arguments', () => {
      spy = jest.spyOn(perfume, 'log');
      (perfume as any).timeToInteractiveCb(1);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Time to interactive', perfume.timeToInteractiveDuration);
    });

    it('should call sendTiming() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).timeToInteractiveCb(1);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('timeToInteractive', perfume.timeToInteractiveDuration);
    });

    it('should perfume.timeToInteractiveDuration be equal to 1', () => {
      (perfume as any).timeToInteractiveCb(1);
      expect(perfume.timeToInteractiveDuration).toEqual(1);
    });
  });

  describe('.logFCP()', () => {
    it('should call log() with the correct arguments', () => {
      spy = jest.spyOn(perfume, 'log');
      (perfume as any).logFCP(1, 'First Contentful Paint', 'firstContentfulPaint');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'First Contentful Paint',
        perfume.firstContentfulPaintDuration
      );
    });

    it('should call sendTiming() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).logFCP(1, 'First Contentful Paint', 'firstContentfulPaint');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'firstContentfulPaint',
        perfume.firstContentfulPaintDuration
      );
    });

    it('should perfume.firstContentfulPaintDuration be equal to duration', () => {
      (perfume as any).logFCP(1, 'First Contentful Paint', 'firstContentfulPaint');
      expect(perfume.firstContentfulPaintDuration).toEqual(1);
    });
  });

  describe('.sendTiming()', () => {
    it('should call analyticsLogger() if analyticsLogger is defined', () => {
      perfume.config.analyticsLogger = (metricName, duration) => {
        // console.log(metricName, duration);
      };
      spy = jest.spyOn(perfume.config, 'analyticsLogger');
      (perfume as any).sendTiming('metricName', 123);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('metricName', 123);
    });

    it('should not call global.logWarn() if googleAnalytics is disable', () => {
      spy = jest.spyOn(perfume, 'logWarn');
      (perfume as any).sendTiming();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call global.logWarn() if googleAnalytics is disable with the correct arguments', () => {
      perfume.config.googleAnalytics.enable = true;
      spy = jest.spyOn(perfume, 'logWarn');
      (perfume as any).sendTiming();
      const text = 'Google Analytics has not been loaded';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(perfume.config.logPrefix, text);
    });

    it('should not call global.logWarn() if googleAnalytics is enable and ga is present', () => {
      perfume.config.googleAnalytics.enable = true;
      spy = jest.spyOn(perfume, 'logWarn');
      window.ga = () => true;
      (perfume as any).sendTiming('metricName', 123);
      expect(spy).not.toHaveBeenCalled();
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
  });
});
