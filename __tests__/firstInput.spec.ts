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
    };
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('.initFirstInputDelay()', () => {
    it('should not call logMetric when entries are empty', () => {
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([]);
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call logMetric when there is at least one entry', () => {
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([{ duration: 10 } as any]);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(10, 'fid');
    });

    it('should call logMetric when perfObservers.lcp is defined', () => {
      (oi as any).perfObservers[2] = { disconnect: jest.fn() };
      (metrics as any).lcp = { value: 1 };
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([{ duration: 10 } as any]);
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(10, 'fid');
      expect(spy).toHaveBeenCalledWith(1, 'lcp');
    });

    it('should call logMetric when perfObservers.cls is defined', () => {
      (oi as any).perfObservers[3] = { takeRecords: jest.fn() };
      (metrics as any).cls = { value: 2 };
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([{ duration: 10 } as any]);
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(10, 'fid');
      expect(spy).toHaveBeenCalledWith(2, 'cls');
    });

    it('should call logMetric when perfObservers.tbt is defined', () => {
      (oi as any).perfObservers[4] = { disconnect: jest.fn() };
      (metrics as any).tbt = { value: 3 };
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([{ duration: 10 } as any]);
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(10, 'fid');
      expect(spy).toHaveBeenCalledWith(3, 'tbt');
    });
  });
});
