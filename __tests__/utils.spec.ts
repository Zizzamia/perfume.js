import { W  } from '../src/constants';
import { pushTask } from '../src/utils';

describe('utils', () => {
  let spy;

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
