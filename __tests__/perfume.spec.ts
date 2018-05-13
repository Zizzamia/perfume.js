import Perfume from '../src/perfume';
import mock from './_mock';

describe('Perfume', () => {
  let perfume: Perfume;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    perfume = new Perfume({...mock.defaultPerfumeConfig});
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

  describe('.observeTimeToInteractive()', () => {
    const instance = new Perfume({timeToInteractive: true});
    (instance as any).perf.timeToInteractive = mock.timeToInteractive;
    (window as any).chrome = true;

    it('should be a promise', () => {
      const promise = instance.observeTimeToInteractive();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should resolve tti on chrome', (done) => {
      instance.observeTimeToInteractive().then((time) => {
        expect(typeof time).toBe('number');
        done();
      });
    });
  });

  describe('.start()', () => {
    it('should throw a console.warn if metricName is not passed', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.start('');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('⚡️ Perfume.js:', 'Please provide a metric name');
    });

    it('should not throw a console.warn if param is correct', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw a console.warn if recording already started', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.start('metricName');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('⚡️ Perfume.js:', 'Recording already started.');
    });
  });

  describe('.end()', () => {
    it('should throw a console.warn if param is not correct', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.end('');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('⚡️ Perfume.js:', 'Please provide a metric name');
    });

    it('should throw a console.warn if param is correct and recording already stopped', () => {
      spy = jest.spyOn(window.console, 'warn');
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
    it('should not throw a console.warn if param is correct', () => {
      spy = jest.spyOn(window.console, 'warn');
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
    it('should call window.console.warn() if params are not correct', () => {
      spy = jest.spyOn(window.console, 'warn');
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
      spy = jest.spyOn((perfume as any), 'logFCP');
      (perfume as any).firstContentfulPaintCb(mock.entries, mock.Promise.resolve, mock.Promise.reject);
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(1, 'First Paint', 'firstPaint');
      expect(spy).toHaveBeenCalledWith(1, 'First Contentful Paint', 'firstContentfulPaint');
    });

    it('should not call logFCP() when firstPaint and firstContentfulPaint is false', () => {
      perfume.config.firstPaint = false;
      perfume.config.firstContentfulPaint = false;
      spy = jest.spyOn((perfume as any), 'logFCP');
      (perfume as any).firstContentfulPaintCb(mock.entries, mock.Promise.resolve, mock.Promise.reject);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call timeToInteractive()', () => {
      perfume.config.timeToInteractive = true;
      spy = jest.spyOn((perfume as any).perf, 'timeToInteractive');
      (perfume as any).firstContentfulPaintCb(mock.entries, mock.Promise.resolve, mock.Promise.reject);
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
      spy = jest.spyOn((perfume as any), 'sendTiming');
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
      expect(spy).toHaveBeenCalledWith('First Contentful Paint', perfume.firstContentfulPaintDuration);
    });

    it('should call sendTiming() with the correct arguments', () => {
      spy = jest.spyOn((perfume as any), 'sendTiming');
      (perfume as any).logFCP(1, 'First Contentful Paint', 'firstContentfulPaint');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('firstContentfulPaint', perfume.firstContentfulPaintDuration);
    });

    it('should perfume.firstContentfulPaintDuration be equal to duration', () => {
      (perfume as any).logFCP(1, 'First Contentful Paint', 'firstContentfulPaint');
      expect(perfume.firstContentfulPaintDuration).toEqual(1);
    });
  });

  describe('.sendTiming()', () => {
    it('should not call global.console.warn() if googleAnalytics is disable', () => {
      spy = jest.spyOn(window.console, 'warn');
      (perfume as any).sendTiming();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call global.console.warn() if googleAnalytics is disable with the correct arguments', () => {
      perfume.config.googleAnalytics.enable = true;
      spy = jest.spyOn(window.console, 'warn');
      (perfume as any).sendTiming();
      const text = 'Google Analytics has not been loaded';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(perfume.config.logPrefix, text);
    });

    it('should not call global.console.warn() if googleAnalytics is enable and ga is present', () => {
      perfume.config.googleAnalytics.enable = true;
      spy = jest.spyOn(window.console, 'warn');
      window.ga = () => true;
      (perfume as any).sendTiming('metricName', 123);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
