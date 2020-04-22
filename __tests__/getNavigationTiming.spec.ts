import { WP  } from '../src/constants';
import { getNavigationTiming } from '../src/getNavigationTiming';
import mock from './_mock';

describe('getNavigationTiming', () => {
  beforeEach(() => {
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
  });

  describe('.getNavigationTiming()', () => {
    it('when performance is not supported should return an empty object', () => {
      (WP as any).mark = undefined;
      expect(getNavigationTiming()).toEqual({});
    });

    it('when performance is supported should return the correct value', () => {
      expect(getNavigationTiming()).toEqual({
        dnsLookupTime: 0,
        downloadTime: 0.6899998988956213,
        fetchTime: 4.435000009834766,
        headerSize: 0,
        timeToFirstByte: 3.745000110939145,
        totalTime: 4.435000009834766,
        workerTime: 4.435000009834766,
      });
    });

    it('when workerStart is 0 should return 0', () => {
      jest.spyOn(WP, 'getEntriesByType').mockReturnValue([
        {
          workerTime: 0,
        },
      ] as any);
      expect(getNavigationTiming().workerTime).toEqual(0);
    });

    it('when Navigation Timing is not supported yet should return an empty object', () => {
      jest.spyOn(WP, 'getEntriesByType').mockReturnValue([] as any);
      expect(getNavigationTiming()).toEqual({});
    });
  });
});
