import { config } from './config';
import { getNavigatorInfo } from './getNavigatorInfo';
import { visibility } from './onVisibilityChange';
import { IVitalsScore, INavigationType, IPerfumeData } from './types';
import { pushTask } from './utils';

/**
 * Sends the User timing measure to analyticsTracker
 */
export const reportPerf = (
  measureName: string,
  data: IPerfumeData,
  rating: IVitalsScore,
  attribution: object,
  navigationType?: INavigationType,
): void => {
  const reportTask = () => {
    if (!config.analyticsTracker) {
      return;
    }
    // Doesn't send timing when page is hidden
    if (visibility.isHidden && !['CLS', 'INP'].includes(measureName)) {
      return;
    }
    // Send metric to custom Analytics service
    config.analyticsTracker({
      attribution,
      metricName: measureName,
      data,
      navigatorInformation: getNavigatorInfo(),
      rating,
      navigationType,
    });
  };

  // Send CLS and INP metrics immediately,
  // because this metrics are reported when page is hidden or closed
  if (['CLS', 'INP'].includes(measureName)) {
    reportTask();
  } else {
    pushTask(reportTask);
  }
};
