import { config } from '../src/config';
import { WP } from '../src/constants';
import { initLayoutShift } from '../src/cumulativeLayoutShift';
import { initFirstInputDelay } from '../src/firstInput';
import * as log from '../src/log';
import {
  disconnectPerfObserversHidden,
  initPerformanceObserver,
} from '../src/observe';
import { perfObservers } from '../src/observeInstances';
import * as paint from '../src/paint';
import * as po from '../src/performanceObserver';
import mock from './_mock';

describe('observe', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    config.isResourceTiming = false;
    jest.spyOn(paint, 'initFirstPaint').mockImplementation(() => {});
    jest
      .spyOn(paint, 'initLargestContentfulPaint')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('.initPerformanceObserver()', () => {
    it('should call po four times', () => {
      spy = jest.spyOn(po, 'po');
      initPerformanceObserver();
      expect(spy.mock.calls.length).toEqual(4);
      expect(spy).toHaveBeenCalledWith('paint', paint.initFirstPaint);
      expect(spy).toHaveBeenCalledWith('first-input', initFirstInputDelay);
      expect(spy).toHaveBeenCalledWith(
        'largest-contentful-paint',
        paint.initLargestContentfulPaint,
      );
      expect(spy).toHaveBeenCalledWith('layout-shift', initLayoutShift);
    });
  });

  describe('.disconnectPerfObserversHidden()', () => {
    it('should call logMetric', () => {
      perfObservers[2] = { disconnect: jest.fn() };
      perfObservers[3] = { disconnect: jest.fn(), takeRecords: jest.fn() };
      perfObservers[4] = { disconnect: jest.fn() };
      spy = jest.spyOn(log, 'logMetric');
      disconnectPerfObserversHidden();
      expect(spy.mock.calls.length).toEqual(3);
    });
  });
});
