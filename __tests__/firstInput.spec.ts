import { WN, WP } from '../src/constants';
import { initFirstInputDelay } from '../src/firstInput';
import * as log from '../src/log';
import * as metrics from '../src/metrics';
import * as oi from '../src/observeInstances';
import mock from './_mock';

describe('firstInput', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (oi as any).perfObservers = {
      1: { disconnect: jest.fn() },
      2: { disconnect: jest.fn() },
      3: { takeRecords: jest.fn() },
      4: { disconnect: jest.fn() },
    };
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('.initFirstInputDelay()', () => {
    it('should call logMetric three times', () => {
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([]);
      expect(spy.mock.calls.length).toEqual(3);
    });

    it('should call logMetric five times', () => {
      const entry = { duration: 10, processingStart: 20, startTime: 5 };
      (metrics as any).lcp = { value: 1 };
      (metrics as any).cls = { value: 2 };
      (metrics as any).tbt = { value: 3 };
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([entry as any]);
      expect(spy.mock.calls.length).toEqual(5);
      expect(spy).toHaveBeenCalledWith(15, 'fidVitals', { performanceEntry: entry });
      expect(spy).toHaveBeenCalledWith(10, 'fid', { performanceEntry: entry });
      expect(spy).toHaveBeenCalledWith(1, 'lcp');
      expect(spy).toHaveBeenCalledWith(2, 'cls');
      expect(spy).toHaveBeenCalledWith(3, 'tbt');
    });

    it('should conditionally call takeRecords', () => {
      //Delete the takeRecords method which isn't available on Safari and make sure all the metrics are still logged
      delete oi.perfObservers[3].takeRecords;
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([]);
      expect(spy.mock.calls.length).toEqual(3);
    });
  });
});
