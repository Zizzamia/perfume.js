import { W, WP } from '../src/constants';
import { po } from '../src/performanceObserver';
import mock from './_mock';

describe('observe', () => {
  let spy: jest.SpyInstance;
  

  beforeEach(() => {
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
  });

  describe('.performanceObserver()', () => {
    it('should call PerformanceObserver', () => {
      spy = jest.spyOn(W, 'PerformanceObserver' as any);
      po('paint', () => 0);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });
});
