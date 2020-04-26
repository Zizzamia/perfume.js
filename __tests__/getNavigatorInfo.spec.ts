import { WN  } from '../src/constants';
import { getNavigatorInfo } from '../src/getNavigatorInfo';
import mock from './_mock';

describe('getNavigatorInfo', () => {
  describe('.getNavigatorInfo()', () => {
    it('when navigator is not supported should return an empty object', () => {
      (WN as any) = undefined;
      expect(getNavigatorInfo()).toEqual({});
    });

    it('when navigator is supported should return the correct value', () => {
      (WN as any) = mock.navigator();
      expect(getNavigatorInfo()).toEqual({
        deviceMemory: 8,
        hardwareConcurrency: 12,
        isLowEndDevice: false,
        isLowEndExperience: false,
        serviceWorkerStatus: 'unsupported',
      });
    });

    it('when navigator is supported but deviceMemory is not', () => {
      (WN as any) = mock.navigator();
      (WN as any).deviceMemory = undefined;
      expect(getNavigatorInfo()).toEqual({
        deviceMemory: 0,
        hardwareConcurrency: 12,
        isLowEndDevice: false,
        isLowEndExperience: false,
        serviceWorkerStatus: 'unsupported',
      });
    });

    it('when navigator is supported but hardwareConcurrency is not', () => {
      (WN as any) = mock.navigator();
      (WN as any).hardwareConcurrency = undefined;
      expect(getNavigatorInfo()).toEqual({
        deviceMemory: 8,
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        serviceWorkerStatus: 'unsupported',
      });
    });

    it('when serviceWorkerStatus is controlled', () => {
      (WN as any) = mock.navigator();
      (WN as any).serviceWorker = { controller: {} };
      expect(getNavigatorInfo()).toEqual({
        deviceMemory: 8,
        hardwareConcurrency: 12,
        isLowEndDevice: false,
        isLowEndExperience: false,
        serviceWorkerStatus: 'controlled',
      });
    });

    it('when serviceWorkerStatus is supported', () => {
      (WN as any) = mock.navigator();
      (WN as any).serviceWorker = { controller: null };
      expect(getNavigatorInfo()).toEqual({
        deviceMemory: 8,
        hardwareConcurrency: 12,
        isLowEndDevice: false,
        isLowEndExperience: false,
        serviceWorkerStatus: 'supported',
      });
    });
  });
});
