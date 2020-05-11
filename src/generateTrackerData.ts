import { IAnalyticsTrackerOptions } from './types';

export const generateTrackerData = (
  options: IAnalyticsTrackerOptions,
): { metricName: string; duration?: number; value?: any } => {
  const { metricName, data } = options;
  switch (metricName) {
    case 'navigationTiming':
      if (data && data.timeToFirstByte) {
        return { metricName: 'navigationTiming', duration: data };
      }
      break;
    case 'networkInformation':
      if (data && data.effectiveType) {
        return { metricName: 'networkInformation', duration: data };
      }
      break;
    case 'storageEstimate':
      return { metricName: 'storageEstimate', duration: data };
      break;
    case 'fp':
      return { metricName: 'firstPaint', duration: data.duration };
      break;
    case 'fcp':
      return { metricName: 'firstContentfulPaint', duration: data.duration };
      break;
    case 'fid':
      return { metricName: 'firstInputDelay', duration: data.duration };
      break;
    case 'lcp':
      return { metricName: 'largestContentfulPaint', duration: data.duration };
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
      return { metricName: 'totalBlockingTime', duration: data.duration };
      break;
    case 'tbt5S':
      return { metricName: 'totalBlockingTime5S', duration: data.duration };
      break;
    case 'tbt10S':
      return { metricName: 'totalBlockingTime10S', duration: data.duration };
      break;
    case 'tbtFinal':
      return { metricName: 'totalBlockingTimeFinal', duration: data.duration };
      break;
    default:
      return { metricName, duration: data.duration };
      break;
  }

  return { metricName, duration: data.duration };
};
