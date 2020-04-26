import { WP  } from '../src/constants';
import { isPerformanceSupported } from '../src/isSupported';
import mock from './_mock';

describe('isSupported', () => {

  beforeEach(() => {
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
  });

  describe('.isPerformanceSupported()', () => {
    it('should return true if the browser supports the Navigation Timing API', () => {
      expect(isPerformanceSupported()).toEqual(true);
    });

    it('should return false if the browser does not supports performance.mark', () => {
      delete window.performance.mark;
      expect(isPerformanceSupported()).toEqual(false);
    });

    it('should return false if the browser does not supports performance.now', () => {
      window.performance.mark = () => 1;
      delete window.performance.now;
      expect(isPerformanceSupported()).toEqual(false);
    });
  });
});
