import { WN, WP } from '../src/constants';
import { initFirstInputDelay } from '../src/firstInput';
import * as log from '../src/log';
import * as oi from '../src/observeInstances';
import mock from './_mock';

describe('firstInput', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (oi as any).perfObservers = {
      fid: { disconnect: jest.fn() },
    };
  });

  describe('.initFirstInputDelay()', () => {
    it('should not call logMetric when entries are empty', () => {
      spy = jest.spyOn(log, 'logMetric');
      initFirstInputDelay([]);
      expect(spy.mock.calls.length).toEqual(0);
    });
  });
});
