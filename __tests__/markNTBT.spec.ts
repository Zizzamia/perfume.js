/**
 * @jest-environment jsdom
 */
import { C, WN, WP } from '../src/constants';
import { initPerfume } from '../src/perfume';
import { markNTBT } from '../src/markNTBT';
import { ntbt } from '../src/metrics';
import * as observe from '../src/observe';
import { visibility } from '../src/onVisibilityChange';
import mock from './_mock';

describe('Perfume', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WN as any) = mock.navigator();
    (WP as any) = mock.performance();
    initPerfume({ ...mock.defaultPerfumeConfig });
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (C as any).log = (n: any) => n;
    (window as any).console.warn = (n: any) => n;
    (observe as any).perfObservers = {};
    visibility.isHidden = false;
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('markNTBT()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should set ntbt.value to 0', () => {
      ntbt.value = 1234;
      markNTBT();
      expect(ntbt.value).toEqual(0);
    });
  });
});
