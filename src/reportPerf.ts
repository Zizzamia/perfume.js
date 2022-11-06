import { config } from './config';
import { getNavigatorInfo } from './getNavigatorInfo';
import { IVitalsScore } from './types';
import { pushTask } from './utils';

/**
 * Sends the User timing measure to analyticsTracker
 */
export const reportPerf = (
  measureName: string,
  data: any,
  rating: IVitalsScore,
  attribution: object,
): void => {
  pushTask(() => {
    if (!config.analyticsTracker) {
      return;
    }
    // Send metric to custom Analytics service
    config.analyticsTracker({
      attribution,
      metricName: measureName,
      data,
      navigatorInformation: getNavigatorInfo(),
      rating,
    });
  });
};
