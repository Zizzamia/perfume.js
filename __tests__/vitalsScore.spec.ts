import { webVitalsScore, getVitalsScore } from '../src/vitalsScore';

describe('vitalsScore', () => {
  let spy: jest.SpyInstance;

  describe('webVitalsScore', () => {
    it('should default to the correct values', () => {
      expect(webVitalsScore).toEqual({
        fp: [1000, 2500],
        fcp: [1000, 2500],
        lcp: [2500, 4000],
        lcpFinal: [2500, 4000],
        fid: [100, 300],
        fidVitals: [100, 300],
        cls: [0.1, 0.25],
        clsFinal: [0.1, 0.25],
        tbt: [300, 600],
        tbt5S: [300, 600],
        tbt10S: [300, 600],
        tbtFinal: [300, 600],
      });
    });
  });

  describe('.getVitalsScore()', () => {
    it('should return the correct values for fcp', () => {
      expect(getVitalsScore('fcp', 200)).toEqual('good');
      expect(getVitalsScore('fcp', 1200)).toEqual('needsImprovement');
      expect(getVitalsScore('fcp', 3200)).toEqual('poor');
    });

    it('should return the correct values for lcp', () => {
      expect(getVitalsScore('lcp', 200)).toEqual('good');
      expect(getVitalsScore('lcp', 3200)).toEqual('needsImprovement');
      expect(getVitalsScore('lcp', 5200)).toEqual('poor');
    });

    it('should return the correct values for lcpFinal', () => {
      expect(getVitalsScore('lcpFinal', 200)).toEqual('good');
      expect(getVitalsScore('lcpFinal', 3200)).toEqual('needsImprovement');
      expect(getVitalsScore('lcpFinal', 5200)).toEqual('poor');
    });

    it('should return the correct values for fid', () => {
      expect(getVitalsScore('fid', 80)).toEqual('good');
      expect(getVitalsScore('fid', 150)).toEqual('needsImprovement');
      expect(getVitalsScore('fid', 400)).toEqual('poor');
    });

    it('should return the correct values for fidVitals', () => {
      expect(getVitalsScore('fidVitals', 80)).toEqual('good');
      expect(getVitalsScore('fidVitals', 150)).toEqual('needsImprovement');
      expect(getVitalsScore('fidVitals', 400)).toEqual('poor');
    });

    it('should return the correct values for cls', () => {
      expect(getVitalsScore('cls', 0.05)).toEqual('good');
      expect(getVitalsScore('cls', 0.2)).toEqual('needsImprovement');
      expect(getVitalsScore('cls', 0.3)).toEqual('poor');
    });

    it('should return the correct values for clsFinal', () => {
      expect(getVitalsScore('clsFinal', 0.05)).toEqual('good');
      expect(getVitalsScore('clsFinal', 0.2)).toEqual('needsImprovement');
      expect(getVitalsScore('clsFinal', 0.3)).toEqual('poor');
    });

    it('should return the correct values for tbt', () => {
      expect(getVitalsScore('tbt', 200)).toEqual('good');
      expect(getVitalsScore('tbt', 400)).toEqual('needsImprovement');
      expect(getVitalsScore('tbt', 700)).toEqual('poor');
    });

    it('should return the correct values for tbt', () => {
      expect(getVitalsScore('tbt', 200)).toEqual('good');
      expect(getVitalsScore('tbt', 400)).toEqual('needsImprovement');
      expect(getVitalsScore('tbt', 700)).toEqual('poor');
    });

    it('should return the correct values for tbt5S', () => {
      expect(getVitalsScore('tbt5S', 200)).toEqual('good');
      expect(getVitalsScore('tbt5S', 400)).toEqual('needsImprovement');
      expect(getVitalsScore('tbt5S', 700)).toEqual('poor');
    });

    it('should return the correct values for tbt10S', () => {
      expect(getVitalsScore('tbt10S', 200)).toEqual('good');
      expect(getVitalsScore('tbt10S', 400)).toEqual('needsImprovement');
      expect(getVitalsScore('tbt10S', 700)).toEqual('poor');
    });

    it('should return the correct values for tbtFinal', () => {
      expect(getVitalsScore('tbtFinal', 200)).toEqual('good');
      expect(getVitalsScore('tbtFinal', 400)).toEqual('needsImprovement');
      expect(getVitalsScore('tbtFinal', 700)).toEqual('poor');
    });
  });
});
