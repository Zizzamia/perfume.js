import EmulatedPerformance, {PerformancePaintTiming} from '../src/emulated-performance';
import {Metrics} from '../src/perfume';
import mock from './_mock';

describe('EmulatedPerformance', () => {
  let service: EmulatedPerformance | any;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    service = new EmulatedPerformance({...mock.defaultPerfumeConfig, logPrefix: ''});
    mock.performance();
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('.now()', () => {
    it('should return Date.now() / 1000', () => {
      (window as any).Date = mock.Date;
      expect(service.now()).toEqual(1);
    });
  });

  describe('.mark()', () => {
    it('should has "mark" method ', () => {
      expect(service.mark).toBeDefined();
    });
  });

  describe('.measure()', () => {
    it('should call getDurationByMetric() with the correct arguments', () => {
      const metrics: Metrics = {
        age: {end: 2018, start: 1987},
      };
      spy = jest.spyOn(service, 'getDurationByMetric');
      service.measure('age', metrics);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('age', metrics);
    });
  });

  describe('.firstContentfulPaint()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should call getFirstPaint() after the setTimeout', () => {
      spy = jest.spyOn(service, 'getFirstPaint');
      service.firstContentfulPaint(() => 1);
      jest.runAllTimers();
      expect(spy.mock.calls.length).toEqual(1);
      jest.clearAllTimers();
    });
  });

  describe('.getDurationByMetric()', () => {
    it('should return the duration', () => {
      const duration = service.getDurationByMetric('age', {
        age: {end: 2018, start: 1987},
      } as Metrics);
      expect(duration).toEqual(31);
    });

    it('should return the -1 when duration is 0', () => {
      const duration = service.getDurationByMetric('age', {
        age: {end: 2018, start: 2018},
      } as Metrics);
      expect(duration).toEqual(0);
    });
  });

  describe('.getFirstPaint()', () => {
    it('should return 0 if PerformanceTiming.navigationStart is 0', () => {
      (window.performance as any).timing = {navigationStart: 0};
      const performance: PerformancePaintTiming = service.getFirstPaint();
      expect(performance).toEqual([{
        duration: 0,
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 0,
      }]);
    });

    it('should return performancePaintTiming', () => {
      (window.performance as any).timing = {navigationStart: 240};
      const performance: PerformancePaintTiming = service.getFirstPaint();
      expect(performance).toEqual([{
        duration: 0,
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 760,
      }]);
    });
  });
});
