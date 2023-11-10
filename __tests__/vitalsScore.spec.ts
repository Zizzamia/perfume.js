/**
 * @jest-environment jsdom
 */
import { webVitalsScore, getVitalsScore, getRating } from '../src/vitalsScore';

describe('vitalsScore', () => {
  describe('webVitalsScore', () => {
    it('should default to the correct values', () => {
      expect(webVitalsScore).toEqual({
        RT: [100, 200],
        TBT: [200, 600],
        NTBT: [200, 600],
      });
    });
  });

  describe('getVitalsScore()', () => {
    it('should return the correct values for RT', () => {
      expect(getVitalsScore('RT', 80)).toEqual('good');
      expect(getVitalsScore('RT', 120)).toEqual('needsImprovement');
      expect(getVitalsScore('RT', 220)).toEqual('poor');
    });

    it('should return the correct values for TBT', () => {
      expect(getVitalsScore('TBT', 100)).toEqual('good');
      expect(getVitalsScore('TBT', 200)).toEqual('good');
      expect(getVitalsScore('TBT', 201)).toEqual('needsImprovement');
      expect(getVitalsScore('TBT', 700)).toEqual('poor');
    });

    it('should return the correct values for NTBT', () => {
      expect(getVitalsScore('NTBT', 100)).toEqual('good');
      expect(getVitalsScore('NTBT', 200)).toEqual('good');
      expect(getVitalsScore('NTBT', 201)).toEqual('needsImprovement');
      expect(getVitalsScore('NTBT', 700)).toEqual('poor');
    });

    it('should return null if vital does not exist', () => {
      expect(getVitalsScore('InvalidVital', 100)).toBeNull();
    });
  });

  describe('getRating()', () => {
    it('should return the correct values', () => {
      expect(getRating(50, [100, 200])).toEqual('good');
      expect(getRating(150, [100, 200])).toEqual('needsImprovement');
      expect(getRating(250, [100, 200])).toEqual('poor');
    });
  });
});
