import * as log from '../src/log';
import { initFirstPaint, initElementTiming } from '../src/paint';
import mock from './_mock';

describe('paint', () => {
  let spy: jest.SpyInstance;

  describe('.initFirstPaint()', () => {
    it('should not call logMetric when entries are empty', () => {
      spy = jest.spyOn(log, 'logMetric');
      initFirstPaint([]);
      expect(spy.mock.calls.length).toEqual(0);
    });
  });

  describe('.initElementTiming()', () => {
    it('should not call logMetric when entries do not have an identifier', () => {
      spy = jest.spyOn(log, 'logMetric');
      initElementTiming([]);
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call logMetric when entries have an identifier', () => {
      spy = jest.spyOn(log, 'logMetric');
      initElementTiming([{...mock.PerformanceEntry, ...{identifier: "elPageTitle"}}]);
      expect(spy.mock.calls.length).toEqual(1);
    });
  });
});
