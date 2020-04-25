import { W } from '../src/constants';
import { convertToKB, pushTask } from '../src/utils';

describe('utils', () => {
  let spy: jest.SpyInstance;

  describe('.convertToKB()', () => {
    it('should convert number to Kilo Bytes', () => {
      expect(convertToKB(100000000)).toEqual(95.37);
    });

    it('should return null when input is not a number', () => {
      // @ts-ignore
      expect(convertToKB('100000000')).toEqual(null);
    });
  });

  describe('.pushTask()', () => {
    it('should call cb() if requestIdleCallback is undefined', () => {
      spy = jest.fn();
      pushTask(spy);
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should call requestIdleCallback if is defined', () => {
      spy = jest.fn();
      (W as any).requestIdleCallback = spy;
      pushTask(() => {});
      expect(spy.mock.calls.length).toEqual(1);
    });
  });
});
