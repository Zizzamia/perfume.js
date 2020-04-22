import { WN  } from '../src/constants';
import { getNetworkInformation } from '../src/getNetworkInformation';
import mock from './_mock';

describe('getNavigationTiming', () => {
  describe('.getNetworkInformation()', () => {
    it('when connection is not supported should return an empty object', () => {
      delete (WN as any).connection;
      expect(getNetworkInformation()).toEqual({});
    });

    it('when connection is supported should return the correct value', () => {
      (WN as any) = mock.navigator();
      expect(getNetworkInformation()).toEqual({
        effectiveType: '4g',
        rtt: 50,
        downlink: 2.3,
        saveData: false,
      });
    });

    it('when connection is supported and connection is not an object should return an empty object', () => {
      (WN as any) = mock.navigator();
      (WN as any).connection = 'test';
      expect(getNetworkInformation()).toEqual({});
    });
  });
});
