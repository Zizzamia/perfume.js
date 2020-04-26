import { WP } from '../src/constants';
import * as measure from '../src/measure';
import mock from './_mock';

describe('measure', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('.getDurationByMetric()', () => {
    it('should return entry.duration when entryType is not measure', () => {
      WP.getEntriesByName = () =>
        [{ duration: 12345, entryType: 'notMeasure' } as any] as any[];
      const value = measure.getDurationByMetric('metricName');
      expect(value).toEqual(-1);
    });

    it('should return -1 when entryType is a measure', () => {
      const value = measure.getDurationByMetric('metricName');
      expect(value).toEqual(12346);
    });
  });

  describe('.performanceMeasure()', () => {
    it('should call window.performance.measure with the correct arguments', () => {
      spy = jest.spyOn(WP, 'measure');
      measure.performanceMeasure('fibonacci');
      const start = 'mark_fibonacci_start';
      const end = 'mark_fibonacci_end';
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci', start, end);
    });

    it('should call getDurationByMetric with the correct arguments', () => {
      spy = jest.spyOn(measure, 'getDurationByMetric');
      measure.performanceMeasure('fibonacci');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci');
    });
  });
});
