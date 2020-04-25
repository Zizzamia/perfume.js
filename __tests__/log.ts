import { C } from '../src/constants';
import { config } from '../src/config';
import { log, logData, logWarn } from '../src/log';
import { visibility } from '../src/onVisibilityChange';
import * as utils from '../src/utils';

describe('log', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
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
      config.logging = false;
      spy = jest.spyOn(C, 'log');
      log({
        measureName: 'metricNameHidden',
        data: '1245.00 ms',
        navigatorInfo: {},
      });
      expect(spy).not.toHaveBeenCalled();
    });
    
    it('should not call window.console.log() if visibility is hidden', () => {
      config.logging = true;
      visibility.isHidden = true;
      spy = jest.spyOn(C, 'log');
      log({
        measureName: 'metricName',
        data: '1245.00 ms',
        navigatorInfo: {},
      });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if logging is enabled', () => {
      config.logging = true;
      spy = jest.spyOn(C, 'log');
      log({
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
      config.logging = true;
      spy = jest.spyOn(C, 'log');
      log({
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
      config.logging = true;
      spy = jest.spyOn(C, 'log');
      log({
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
      logData('measureName', {});
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.logWarn()', () => {
    it('should throw a console.warn if config.warning is true', () => {
      spy = jest.spyOn(window.console, 'warn');
      logWarn('message');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(config.logPrefix, 'message');
    });

    /**
    it('should not throw a console.warn if config.logging is false', () => {
      spy = jest.spyOn(window.console, 'warn');
      config.logging = false;
      logWarn('message');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });
    */
  });
});
