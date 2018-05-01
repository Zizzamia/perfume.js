import EmulatedPerformance from '../src/emulated-performance';

/**
 * Emulated performance test
 */
describe('Emulated performance test', () => {
  let service: any;

  beforeEach(() => {
    (window as any).Date = {
      now: () => {
        return 1000;
      },
    };
    (window as any).performance = {
      timing: {
        navigationStart: 0,
      },
    };
    service = new EmulatedPerformance({
      logPrefix: '',
    } as any);
  });

  beforeEach(() => {
    spyOn(global.console, 'warn').and.callThrough();
    spyOn(service, 'now').and.callThrough();
    spyOn(service, 'mark').and.callThrough();
    spyOn(service, 'measure').and.callThrough();
    spyOn(service, 'firstContentfulPaint').and.callThrough();
    spyOn(service, 'getDurationByMetric').and.callThrough();
    spyOn(service, 'getFirstPaint').and.callThrough();
  });

  describe('when calls now()', () => {
    it('should return Date.now() / 1000', () => {
      expect(service.now()).toEqual(1);
    });
  });

  it('has "mark" method ', () => {
    expect(service.mark).toBeDefined();
  });

  describe('when calls measure()', () => {
    it('should call getDurationByMetric() with the correct arguments', () => {
      const metrics = {
        age: {
          end: 2018,
          start: 1987,
        },
      };
      service.measure('age', metrics);
      expect(service.getDurationByMetric.calls.count()).toEqual(1);
      expect(service.getDurationByMetric).toHaveBeenCalledWith('age', metrics);
    });
  });

  describe('when calls firstContentfulPaint()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should call getFirstPaint() after the setTimeout', () => {
      service.firstContentfulPaint(() => {
        return 1;
      });
      jest.runAllTimers();
      expect(service.getFirstPaint.calls.count()).toEqual(1);
    });
  });

  describe('when calls getDurationByMetric()', () => {
    it('should return the duration', () => {
      const metrics = {
        age: {
          end: 2018,
          start: 1987,
        },
      };
      const duration = service.getDurationByMetric('age', metrics);
      expect(duration).toEqual(31);
    });

    it('should return the -1 when duration is 0', () => {
      const metrics = {
        age: {
          end: 2018,
          start: 2018,
        },
      };
      const duration = service.getDurationByMetric('age', metrics);
      expect(duration).toEqual(0);
    });
  });

  describe('when calls getFirstPaint()', () => {
    it('should return 0 if PerformanceTiming.navigationStar is 0', () => {
      const performance = service.getFirstPaint();
      expect(performance).toEqual([{
        duration: 0,
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 0,
      }]);
    });

    it('should return performancePaintTiming', () => {
      (window.performance as any).timing.navigationStart = 240;
      const performance = service.getFirstPaint();
      expect(performance).toEqual([{
        duration: 0,
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 760,
      }]);
    });
  });
});
