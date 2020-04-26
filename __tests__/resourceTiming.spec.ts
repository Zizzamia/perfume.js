import { config } from '../src/config';
import * as log from '../src/log';
import { rt } from '../src/metrics';
import * as resourceTiming from '../src/resourceTiming';

describe('resourceTiming', () => {
  let spy: jest.SpyInstance;

  describe('.initResourceTiming()', () => {
    beforeEach(() => {
      (rt as any).value = {
        css: 0,
        fetch: 0,
        total: 0,
      };
      config.isResourceTiming = true;
    });

    it('should dataConsumption be 0 when entries are empty', () => {
      resourceTiming.initResourceTiming([]);
      expect(rt.value).toEqual({
        css: 0,
        fetch: 0,
        total: 0,
      });
    });

    it('should float the dataConsumption result', () => {
      resourceTiming.initResourceTiming([
        {
          decodedBodySize: 12345678,
          // @ts-ignore
          initiatorType: 'css',
        },
      ]);
      expect(rt.value).toEqual({
        css: 12345.678,
        fetch: 0,
        total: 12345.678,
      });
    });

    it('should sum the dataConsumption result', () => {
      resourceTiming.initResourceTiming([
        {
          decodedBodySize: 12345678,
          // @ts-ignore
          initiatorType: 'css',
        },
        {
          decodedBodySize: 10000678,
          // @ts-ignore
          initiatorType: 'fetch',
        },
      ]);
      expect(rt.value).toEqual({
        css: 12345.678,
        fetch: 10000.678,
        total: 22346.356,
      });
    });

    it('should call logData for each performanceEntry', () => {
      spy = jest.spyOn(log, 'logData');
      resourceTiming.initResourceTiming([
        {
          decodedBodySize: 12345678,
          // @ts-ignore
          initiatorType: 'css',
        },
        {
          decodedBodySize: 10000678,
          // @ts-ignore
          initiatorType: 'fetch',
        },
      ]);
      expect(spy.mock.calls.length).toEqual(2);
    });
  });
});
