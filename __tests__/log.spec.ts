/**
 * @jest-environment jsdom
 */
import { C, WN, WP } from '../src/constants';
import * as log from '../src/log';
import { visibility } from '../src/onVisibilityChange';
import * as reportPerf from '../src/reportPerf';
import * as utils from '../src/utils';
import mock from './_mock';

describe('log', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
    (C as any).log = (n: any) => n;
    visibility.isHidden = false;
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('.logData()', () => {
    it('should call pushTask', () => {
      spy = jest.spyOn(utils, 'pushTask');
      log.logData('measureName', {});
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.logMetric()', () => {
    it('should call reportPerf() when value is 0', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric({
        attribution: {},
        name: 'CLS',
        rating: 'good',
        value: 0
      });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('CLS', 0, 'good', {});
    });

    it('should call reportPerf() with the correct arguments', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric({
        attribution: {},
        name: 'FCP',
        rating: 'good',
        value: 1
      });
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('FCP', 1, 'good', {});
    });

    it('should not call reportPerf() when duration is higher of config.maxTime', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric({
        attribution: {},
        name: 'FCP',
        rating: 'good',
        value: 40000
      });
      expect(spy.mock.calls.length).toEqual(0);
    });
  });
});
