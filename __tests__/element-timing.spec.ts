/**
 * @jest-environment jsdom
 */
import * as log from '../src/log';
import { initElementTiming } from '../src/element-timing';
import mock from './_mock';

describe('element-timing', () => {
  let spy: jest.SpyInstance;

  describe('.initElementTiming()', () => {
    it('should not call logMetric when entries do not have an identifier', () => {
      spy = jest.spyOn(log, 'logMetric');
      initElementTiming([]);
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call logMetric when entries have an identifier', () => {
      spy = jest.spyOn(log, 'logMetric');
      initElementTiming([
        { ...mock.PerformanceEntry, ...{ identifier: 'elPageTitle' } },
      ]);
      expect(spy.mock.calls.length).toEqual(1);
    });
  });
});
