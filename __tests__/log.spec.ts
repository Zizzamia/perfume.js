import { C, WN, WP } from '../src/constants';
import { config } from '../src/config';
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

  describe('.log()', () => {
    beforeEach(() => {
      visibility.isHidden = false;
    });

    
    it('should not call window.console.log() if logging is disabled', () => {
      config.isLogging = false;
      spy = jest.spyOn(C, 'log');
      log.log({
        measureName: 'metricNameHidden',
        data: '1245.00 ms',
        navigatorInfo: {},
      });
      expect(spy).not.toHaveBeenCalled();
    });
    
    it('should not call window.console.log() if visibility is hidden', () => {
      config.isLogging = true;
      visibility.isHidden = true;
      spy = jest.spyOn(C, 'log');
      log.log({
        measureName: 'metricName',
        data: '1245.00 ms',
        navigatorInfo: {},
      });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if logging is enabled', () => {
      config.isLogging = true;
      spy = jest.spyOn(C, 'log');
      log.log({
        measureName: 'metricName',
        data: '1235.00 ms',
        navigatorInfo: {},
      });
      const text = '%c Perfume.js: metricName ';
      const style = 'color:#ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style, '1235.00 ms', {});
    });

    it('should call window.console.log() if params are correct', () => {
      config.isLogging = true;
      spy = jest.spyOn(C, 'log');
      log.log({
        measureName: 'metricName',
        data: '1245.00 ms',
        navigatorInfo: {},
      });
      const text = '%c Perfume.js: metricName ';
      const style = 'color:#ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style, '1245.00 ms', {});
    });

    it('should call window.console.log() with data', () => {
      const data = {};
      config.isLogging = true;
      spy = jest.spyOn(C, 'log');
      log.log({
        measureName: 'metricName',
        data,
        navigatorInfo: {},
      });
      const text = '%c Perfume.js: metricName ';
      const style = 'color:#ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style, data, {});
    });
  });

  describe('.logData()', () => {
    it('should call pushTask', () => {
      spy = jest.spyOn(utils, 'pushTask');
      log.logData('measureName', {});
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.logMetric()', () => {
    it('should call log() with the correct arguments', () => {
      spy = jest.spyOn(log, 'log');
      log.logMetric(1, 'fcp');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        data: '1 ms',
        measureName: 'fcp',
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });

    it('should call reportPerf() with the correct arguments', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric(1, 'fcp');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        data: 1,
        measureName: 'fcp',
        navigatorInfo: {
          deviceMemory: 8,
          hardwareConcurrency: 12,
          isLowEndDevice: false,
          isLowEndExperience: false,
          serviceWorkerStatus: 'unsupported',
        },
      });
    });

    it('should not call reportPerf() when duration is higher of config.maxTime', () => {
      spy = jest.spyOn(reportPerf, 'reportPerf');
      log.logMetric(20000, 'fcp');
      expect(spy.mock.calls.length).toEqual(0);
    });
  });
});
