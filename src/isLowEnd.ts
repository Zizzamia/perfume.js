import { getDM, getHC } from './constants';
import { EffectiveConnectionType } from './types';

export const getIsLowEndDevice = (): boolean => {
  // If number of logical processors available to run threads <= 4
  if (getHC() && getHC() <= 4) {
    return true;
  }
  // If the approximate amount of RAM client device has <= 4
  if (getDM() && getDM() <= 4) {
    return true;
  }
  return false;
};

export const getIsLowEndExperience = (
  et: EffectiveConnectionType,
  sd: boolean,
): boolean => {
  // If the effective type of the connection meaning
  // one of 'slow-2g', '2g', '3g', or '4g' is !== 4g
  switch (et) {
    case 'slow-2g':
      return true;
      break;
    case '2g':
      return true;
      break;
    case '3g':
      return true;
      break;
    default:
      // Data Saver preference
      return (getIsLowEndDevice() || sd);
  }
};
