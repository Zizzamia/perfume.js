import { config } from './config';
import { getNavigatorInfo } from './getNavigatorInfo';
import { visibility } from './onVisibilityChange';
import { IVitalsScore } from './types';
import { pushTask } from './utils';

/**
 * Sends the User timing measure to analyticsTracker
 */
export const reportPerf = function(
  measureName: string,
  data: any,
  rating: IVitalsScore,
  attribution: object,
): void {
  pushTask(() => {
    // Doesn't send timing when page is hidden
    if (
      (visibility.isHidden) ||
      !config.analyticsTracker
    ) {
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
