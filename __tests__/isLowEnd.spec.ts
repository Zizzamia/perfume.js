import { WN  } from '../src/constants';
import { getIsLowEndDevice, getIsLowEndExperience } from '../src/isLowEnd';
import mock from './_mock';

describe('isLowEnd', () => {

  beforeEach(() => {
    (WN as any) = mock.navigator();
  });

  describe('isLowEndDevice', () => {
    it('should return false as default option', () => {
      expect(getIsLowEndDevice()).toEqual(false);
    });

    it('should return true when hardwareConcurrency is 4', () => {
      (WN as any).hardwareConcurrency = 4;
      expect(getIsLowEndDevice()).toEqual(true);
    });

    it('should return true when deviceMemory is 4', () => {
       (WN as any).hardwareConcurrency = 8;
       (WN as any).deviceMemory = 4;
      expect(getIsLowEndDevice()).toEqual(true);
    });
  });

  describe('isLowEndExperience', () => {
    it('should return false as default option', () => {
      expect(getIsLowEndExperience('4g', false)).toEqual(false);
    });

    it('should return true when isLowEndDevice is true', () => {
      (WN as any).hardwareConcurrency = 4;
      (WN as any).deviceMemory = 4;
      expect(getIsLowEndExperience('4g', false)).toEqual(true);
    });

    it('should return true when et is 3g', () => {
      (WN as any).hardwareConcurrency = 8;
      (WN as any).deviceMemory = 8;
      expect(getIsLowEndExperience('3g', false)).toEqual(true);
    });

    it('should return true when et is 2g', () => {
      expect(getIsLowEndExperience('2g', false)).toEqual(true);
    });

    it('should return true when et is slow-2g', () => {
      expect(getIsLowEndExperience('slow-2g', false)).toEqual(true);
    });

    it('should return true when saveData is true', () => {
      expect(getIsLowEndExperience('4g', true)).toEqual(true);
    });
  });
});
