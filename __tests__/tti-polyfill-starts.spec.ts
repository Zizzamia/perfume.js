import PerformanceObserverTTI from '../src/tti-polyfill-starts';
import mock from './_mock';

describe('PerformanceObserverTTI', () => {
  let service: PerformanceObserverTTI | any;

  beforeEach(() => {
    service = new PerformanceObserverTTI();
  });

  describe('.supported()', () => {
    it('should return ', () => {
      service.create();
      expect(service.g).not.toBeDefined();
    });

    it('should return ', () => {
      (window as any).PerformanceLongTaskTiming = () => {};
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      service.create();
      expect(service.g).toBeDefined();
    });
  });
});
