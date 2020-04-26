import * as log from '../src/log';
import { initFirstPaint } from '../src/paint';

describe('paint', () => {
  let spy: jest.SpyInstance;

  describe('.initFirstPaint()', () => {
    it('should not call logMetric when entries are empty', () => {
      spy = jest.spyOn(log, 'logMetric');
      initFirstPaint([]);
      expect(spy.mock.calls.length).toEqual(0);
    });
  });
});
