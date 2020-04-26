import { fcp, tbt } from '../src/metrics';
import { initTotalBlockingTime } from '../src/totalBlockingTime';

describe('totalBlockingTime', () => {
  describe('.initTotalBlockingTime()', () => {
    beforeEach(() => {
      fcp.value = 10;
      tbt.value = 0;
    });

    it('should keep the value to 0 when PerformanceEntry are empty', () => {
      initTotalBlockingTime([]);
      expect(tbt.value).toEqual(0);
    });

    it('should keep the value to 0 when PerformanceEntry are not self', () => {
      const pe = {
        name: 'nope',
        startTime: 10,
      } as any;
      initTotalBlockingTime([pe]);
      expect(tbt.value).toEqual(0);
    });

    it('should set correctly the value', () => {
      const pe = {
        name: 'self',
        startTime: 20,
        duration: 60,
      } as any;
      const peTwo = {
        name: 'self',
        startTime: 20,
        duration: 40,
      } as any;
      initTotalBlockingTime([pe, peTwo, pe]);
      expect(tbt.value).toEqual(20);
    });

    it('should keep the value to 0 when tasks are not large enough', () => {
      const peTwo = {
        name: 'self',
        startTime: 20,
        duration: 40,
      } as any;
      initTotalBlockingTime([peTwo]);
      expect(tbt.value).toEqual(0);
    });
  });
});
