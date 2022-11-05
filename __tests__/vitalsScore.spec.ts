/**
 * @jest-environment jsdom
 */
import { webVitalsScore, getVitalsScore } from '../src/vitalsScore';

describe('vitalsScore', () => {
  describe('webVitalsScore', () => {
    it('should default to the correct values', () => {
      expect(webVitalsScore).toEqual({
        rt: [100, 200],
        tbt: [200, 600],
        ntbt: [200, 600],
      });
    });
  });

  describe('getVitalsScore()', () => {
    it('should return the correct values for rt', () => {
      expect(getVitalsScore('rt', 80)).toEqual('good');
      expect(getVitalsScore('rt', 120)).toEqual('needsImprovement');
      expect(getVitalsScore('rt', 220)).toEqual('poor');
    });

    it('should return the correct values for tbt', () => {
      expect(getVitalsScore('tbt', 100)).toEqual('good');
      expect(getVitalsScore('tbt', 200)).toEqual('good');
      expect(getVitalsScore('tbt', 201)).toEqual('needsImprovement');
      expect(getVitalsScore('tbt', 700)).toEqual('poor');
    });

    it('should return the correct values for ntbt', () => {
      expect(getVitalsScore('ntbt', 100)).toEqual('good');
      expect(getVitalsScore('ntbt', 200)).toEqual('good');
      expect(getVitalsScore('ntbt', 201)).toEqual('needsImprovement');
      expect(getVitalsScore('ntbt', 700)).toEqual('poor');
    });
  });
});
