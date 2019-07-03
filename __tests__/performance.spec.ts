import Performance from '../src/performance';
import { IPerformanceEntry, IPerfumeConfig } from '../src/perfume';
import mock from './_mock';

describe('Performance', () => {
  let service: Performance | any;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    service = new Performance({ ...mock.defaultPerfumeConfig } as IPerfumeConfig);
    mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('.supported()', () => {
    it('should return true if the browser supports the Navigation Timing API', () => {
      expect(Performance.supported()).toEqual(true);
    });

    it('should return false if the browser does not supports performance.mark', () => {
      delete window.performance.mark;
      expect(Performance.supported()).toEqual(false);
    });

    it('should return false if the browser does not supports performance.now', () => {
      window.performance.mark = () => 1;
      delete window.performance.now;
      expect(Performance.supported()).toEqual(false);
    });
  });

  describe('.now()', () => {
    it('should call window.performance.now', () => {
      spy = jest.spyOn(window.performance, 'now');
      service.now();
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('.mark()', () => {
    it('should call window.performance.mark with undefined argument', () => {
      spy = jest.spyOn(window.performance, 'mark');
      (service as any).mark('fibonacci');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_fibonacci_undefined');
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn(window.performance, 'mark');
      service.mark('fibonacci', 'fast');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_fibonacci_fast');
    });
  });

  describe('.measure()', () => {
    it('should call window.performance.measure with the correct arguments', () => {
      spy = jest.spyOn(window.performance, 'measure');
      (service as any).measure('fibonacci');
      const start = 'mark_fibonacci_start';
      const end = 'mark_fibonacci_end';
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci', start, end);
    });

    it('should call getDurationByMetric with the correct arguments', () => {
      spy = jest.spyOn(service, 'getDurationByMetric');
      service.measure('fibonacci', {});
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci', {});
    });
  });

  describe('.firstContentfulPaint()', () => {
    it('should call initPerformanceObserver()', () => {
      spy = jest.spyOn(window, 'PerformanceObserver' as any);
      service.firstContentfulPaint(() => 0);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.getDurationByMetric()', () => {
    it('should return entry.duration when entryType is not measure', () => {
      window.performance.getEntriesByName = () => [
        { duration: 12345, entryType: 'notMeasure' } as any,
      ] as any[];
      const value = service.getDurationByMetric('metricName');
      expect(value).toEqual(-1);
    });

    it('should return -1 when entryType is a measure', () => {
      const value = service.getDurationByMetric('metricName');
      expect(value).toEqual(12346);
    });
  });

  describe('.getMeasurementForGivenName()', () => {
    it('should return the first PerformanceEntry objects for the given name', () => {
      const value = service.getMeasurementForGivenName('metricName');
      expect(value).toEqual({ duration: 12346, entryType: 'measure' });
    });
  });

  describe('.performanceObserverCb()', () => {
    const entry = { name: 'first-contentful-paint', startTime: 1 };

    beforeEach(() => {
      service.callback = () => 1;
      service.perfObserver = { disconnect: () => true };
    });

    it('should call callback with the correct argument', () => {
      spy = jest.spyOn(service, 'callback');
      service.performanceObserverCb(service.callback, {
        getEntries: () => [entry],
      });
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith([entry]);
    });

    it('should call perfObserver.disconnect', () => {
      spy = jest.spyOn(service.perfObserver, 'disconnect');
      service.config.firstContentfulPaint = true;
      service.performanceObserverCb(service.callback, {
        getEntries: () => [entry],
      });
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should not call perfObserver.disconnect when entries is empty', () => {
      spy = jest.spyOn(service.perfObserver, 'disconnect');
      service.performanceObserverCb(service.callback, { getEntries: () => [] });
      expect(spy).not.toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(0);
    });
  });
});
