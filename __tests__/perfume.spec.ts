import PerformanceEntryItem from '../src/performance-entry-item';
import Perfume, {
  IGoogleAnalyticsConfig,
  IPerfumeConfig,
} from '../src/perfume';
import mock, { MockDateNowValue } from './_mock';

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
    perfume['observers'].set('fcp', () => 400);
    perfume['observers'].set('fid', () => 400);
    perfume['observers'].set('tti', () => 400);
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
        timeToInteractive: false,
        analyticsTracker: undefined,
        googleAnalytics: {
          enable: false,
          timingVar: 'name',
        },
        logPrefix: '⚡️ Perfume.js:',
        logging: true,
        warning: false,
      });
    });
  });

  describe('.observeTimeToInteractive', () => {
    let instance;

    beforeAll(() => {
      instance = new Perfume({ firstContentfulPaint: true });
      (window as any).chrome = true;
      instance['observers'].set('fcp', () => 400);
      instance['observers'].set('fid', () => 400);
      instance['observers'].set('tti', () => 400);
    });

    it('should be a promise', () => {
      const promise = instance.observeFirstContentfulPaint;
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should resolve fcp on chrome', done => {
      instance.observeFirstContentfulPaint.then(duration => {
        expect(typeof duration).toBe('number');
        done();
      });
    });
  });

  describe('.observeTimeToInteractive', () => {
    let instance;

    beforeAll(() => {
      instance = new Perfume({ timeToInteractive: true });
      (window as any).chrome = true;
      instance['observers'].set('fcp', () => 400);
      instance['observers'].set('fid', () => 400);
      instance['observers'].set('tti', () => 400);
    });

    it('should be a promise', () => {
      const promise = instance.observeTimeToInteractive;
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe('.observeFirstInputDelay', () => {
    (window as any).perfMetrics = mock.perfMetrics;
    (window as any).chrome = true;

    beforeEach(() => {
      perfume = new Perfume({ firstInputDelay: true });
      perfume['observers'].set('fcp', () => 400);
      perfume['observers'].set('fid', () => 400);
      perfume['observers'].set('tti', () => 400);
    });

    it('should be a promise', () => {
      const promise = perfume.observeFirstInputDelay;
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should resolve fid on chrome', done => {
      perfume.observeFirstInputDelay.then(duration => {
        expect(typeof duration).toBe('number');
        done();
      });
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
        '⚡️ Perfume.js:',
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
        '⚡️ Perfume.js:',
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
        '⚡️ Perfume.js:',
        'Please provide a metric name',
      );
    });

    it('should throw a logWarn if param is correct and recording already stopped', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        '⚡️ Perfume.js:',
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
      perfume.log('metricName', 12345);
      const text = '%c ⚡️ Perfume.js: metricName 12345.00 ms';
      const style = 'color: #ff6d00;font-size:12px;';
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
      perfume.log('metricName', 12345);
      const text = '%c ⚡️ Perfume.js: metricName 12345.00 ms';
      const style = 'color: #ff6d00;font-size:12px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style);
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
      expect(spy).toHaveBeenCalledWith('metricName', 123);
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
      perfume.config.timeToInteractive = true;
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

    it('should call firstContentfulPaint() with EmulatedPerformance', () => {
      delete (window as any).chrome;
      delete (window as any).PerformanceObserver;
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
      spy = jest.spyOn(perfume['perfEmulated'], 'firstContentfulPaint');
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

  describe('.initTimeToInteractive()', () => {
    beforeEach(() => {
      perfume.config.timeToInteractive = true;
    });

    it('should not call perf.timeToInteractive() when is not supported', () => {
      spy = jest.spyOn(perfume['perf'] as any, 'timeToInteractive');
      delete (window as any).chrome;
      delete (window as any).PerformanceLongTaskTiming;
      delete (window as any).PerformanceObserver;
      perfume.config.timeToInteractive = false;
      perfume['initTimeToInteractive'](0);
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call perf.timeToInteractive() when supported', () => {
      spy = jest.spyOn(perfume['perf'] as any, 'timeToInteractive');
      (window as any).chrome = true;
      (window as any).PerformanceLongTaskTiming =
        mock.PerformanceLongTaskTiming;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initTimeToInteractive'](400);
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.onVisibilityChange()', () => {
    it('should not call document.addEventListener() when document.hidden is undefined', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(undefined);
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

    it('should perfume.timeToInteractiveDuration be equal to duration', () => {
      (perfume as any).logMetric(3, 'Time to Interactive', 'timeToInteractive');
      expect(perfume.timeToInteractiveDuration).toEqual(3);
    });
  });

  // describe('.onWindowLoad()', () => {
  //   const metric1 = new Metric('1', 1);
  //   const metric2 = new Metric('2', 2);

  //   let instance: Perfume = null;

  //   beforeEach(() => {
  //     instance = new Perfume({
  //       googleAnalytics: {
  //         enable: true,
  //       },
  //       analyticsTracker: mock.analyticsTracker,
  //     } as IPerfumeConfig);

  //     instance['analyticsTrackers'].forEach(at => {
  //       at.metricQueue.push(metric1, metric2);
  //     });
  //   });

  //   afterEach(() => {
  //     jest.resetAllMocks();
  //   });

  //   it('should call tracker.send() with queued metrics if canSend()', () => {
  //     const gaTracker = instance['analyticsTrackers'][0] as IAnalyticsTracker;
  //     const gaCanSendMock = jest
  //       .spyOn(gaTracker, 'canSend')
  //       .mockReturnValue(true);
  //     const gaSendMock = jest
  //       .spyOn(gaTracker, 'send')
  //       .mockImplementation(m => true);
  //     const customTracker = instance[
  //       'analyticsTrackers'
  //     ][1] as IAnalyticsTracker;
  //     const customCanSendMock = jest.spyOn(customTracker, 'canSend');
  //     const customSendMock = jest.spyOn(customTracker, 'send');

  //     (instance as any).onWindowLoad();

  //     expect(gaCanSendMock).toHaveBeenCalledTimes(1);
  //     expect(gaSendMock).toHaveBeenCalledTimes(2);
  //     expect(gaSendMock).toHaveBeenNthCalledWith(1, metric2);
  //     expect(gaSendMock).toHaveBeenNthCalledWith(2, metric1);
  //     expect(customCanSendMock).toHaveBeenCalledTimes(1);
  //     expect(customSendMock).toHaveBeenCalledTimes(2);
  //     expect(customSendMock).toHaveBeenNthCalledWith(1, metric2);
  //     expect(customSendMock).toHaveBeenNthCalledWith(2, metric1);
  //   });

  //   it('should call global.logWarn() with queued metrics if !canSend()', () => {
  //     const gaTracker = instance['analyticsTrackers'][0] as IAnalyticsTracker;
  //     const gaCanSendMock = jest
  //       .spyOn(gaTracker, 'canSend')
  //       .mockReturnValue(false);
  //     const gaSendMock = jest
  //       .spyOn(gaTracker, 'send')
  //       .mockImplementation(m => true);
  //     const customTracker = instance[
  //       'analyticsTrackers'
  //     ][1] as IAnalyticsTracker;
  //     const customCanSendMock = jest
  //       .spyOn(customTracker, 'canSend')
  //       .mockReturnValue(false);
  //     const customSendMock = jest.spyOn(customTracker, 'send');
  //     spy = jest.spyOn(instance as any, 'logWarn');

  //     (instance as any).onWindowLoad();

  //     expect(gaCanSendMock).toHaveBeenCalledTimes(1);
  //     expect(customCanSendMock).toHaveBeenCalledTimes(1);
  //     expect(spy).toHaveBeenCalledTimes(2);
  //     expect(spy).toHaveBeenNthCalledWith(
  //       1,
  //       perfume.config.logPrefix,
  //       "Google Analytics was not ready by window.load; 2 metric/s can't be sent for it.",
  //     );
  //     expect(spy).toHaveBeenNthCalledWith(
  //       2,
  //       perfume.config.logPrefix,
  //       "Custom Analytics was not ready by window.load; 2 metric/s can't be sent for it.",
  //     );
  //     expect(gaSendMock).toHaveBeenCalledTimes(0);
  //     expect(customSendMock).toHaveBeenCalledTimes(0);
  //   });
  // });

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
