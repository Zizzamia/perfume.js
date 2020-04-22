import { WN } from './constants';
import { EffectiveConnectionType, IPerfumeNetworkInformation } from './types';

export let et: EffectiveConnectionType = '4g';
export let sd = false;

export const getNetworkInformation = (): IPerfumeNetworkInformation => {
  if ('connection' in WN) {
    const dataConnection = (WN as any).connection;
    if (typeof dataConnection !== 'object') {
      return {};
    }
    et = dataConnection.effectiveType;
    sd = !!dataConnection.saveData;
    return {
      downlink: dataConnection.downlink,
      effectiveType: dataConnection.effectiveType,
      rtt: dataConnection.rtt,
      saveData: !!dataConnection.saveData,
    };
  }
  return {};
};
