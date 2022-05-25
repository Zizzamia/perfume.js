import { webVitalsScore, getVitalsScore } from '../src/vitalsScore';

describe('vitalsScore', () => {
  let spy: jest.SpyInstance;

  describe('webVitalsScore', () => {
    it('should default to the correct values', () => {
      expect(webVitalsScore).toEqual({
        ttfb: [200, 500],
        rt: [100, 200],
        fp: [2000, 4000],
        fcp: [2000, 4000],
        lcp: [2500, 4000],
        lcpFinal: [2500, 4000],
        fid: [100, 300],
        cls: [0.1, 0.25],
        clsFinal: [0.1, 0.25],
        tbt: [200, 600],
        ntbt: [200, 600],
      });
    });
  });

  describe('getVitalsScore()', () => {
    it('should return the correct values for ttfb', () => {
      expect(getVitalsScore('ttfb', 100)).toEqual('good');
      expect(getVitalsScore('ttfb', 300)).toEqual('needsImprovement');
      expect(getVitalsScore('ttfb', 600)).toEqual('poor');
    });

    it('should return the correct values for rt', () => {
      expect(getVitalsScore('rt', 80)).toEqual('good');
      expect(getVitalsScore('rt', 120)).toEqual('needsImprovement');
      expect(getVitalsScore('rt', 220)).toEqual('poor');
    });

    it('should return the correct values for fcp', () => {
      expect(getVitalsScore('fcp', 200)).toEqual('good');
      expect(getVitalsScore('fcp', 2200)).toEqual('needsImprovement');
      expect(getVitalsScore('fcp', 4200)).toEqual('poor');
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
