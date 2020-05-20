import {
  IPerfumeData,
  IAnalyticsTrackerOptions,
  IPerfumeNavigationTiming,
  IPerfumeNetworkInformation,
} from './types';

export const generateTrackerData = (options: IAnalyticsTrackerOptions) => {
  const isIPerfumeDataType = <T extends IPerfumeData>(
    iPerfumeData: IPerfumeData,
  ): iPerfumeData is T => {
    const data = iPerfumeData as T;
    if (typeof iPerfumeData !== 'object') return false;

    const dataKeys = Object.keys(data) as (keyof T)[];
    for (const key of dataKeys) if (data[key] !== undefined) return true;
    return false;
  };

  const { metricName, data } = options;
  switch (metricName) {
    case 'navigationTiming':
      if (
        data &&
        isIPerfumeDataType<IPerfumeNavigationTiming>(data) &&
        data.timeToFirstByte
      ) {
        return { metricName: 'navigationTiming', data };
      }
      break;
    case 'networkInformation':
      if (
        data &&
        isIPerfumeDataType<IPerfumeNetworkInformation>(data) &&
        data.effectiveType
      ) {
        return { metricName: 'networkInformation', data };
      }
      break;
    case 'storageEstimate':
      return { metricName: 'storageEstimate', data };
      break;
    case 'fp':
      return { metricName: 'firstPaint', duration: data };
      break;
    case 'fcp':
      return { metricName: 'firstContentfulPaint', duration: data };
      break;
    case 'fid':
      return { metricName: 'firstInputDelay', duration: data };
      break;
    case 'lcp':
      return { metricName: 'largestContentfulPaint', duration: data };
      break;
    case 'lcpFinal':
      return { metricName: 'largestContentfulPaintFinal', duration: data };
      break;
    case 'cls':
      return { metricName: 'cumulativeLayoutShift', value: data };
      break;
    case 'clsFinal':
      return { metricName: 'cumulativeLayoutShiftFinal', value: data };
      break;
    case 'tbt':
      return { metricName: 'totalBlockingTime', duration: data };
      break;
    case 'tbt5S':
      return { metricName: 'totalBlockingTime5S', duration: data };
      break;
    case 'tbt10S':
      return { metricName: 'totalBlockingTime10S', duration: data };
      break;
    case 'tbtFinal':
      return { metricName: 'totalBlockingTimeFinal', duration: data };
      break;
    default:
      return { metricName: metricName, duration: data };
      break;
  }
};
