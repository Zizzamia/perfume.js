import { config } from './config';
import { getNavigatorInfo } from './getNavigatorInfo';
import { visibility } from './onVisibilityChange';
import { pushTask } from './utils';

/**
 * Sends the User timing measure to analyticsTracker
 */
export const reportPerf = function(
  measureName: string,
  data: any,
  customProperties?: object,
): void {
  pushTask(() => {
    // Doesn't send timing when page is hidden
    if (
      (visibility.isHidden && measureName.indexOf('Final') < 0) ||
      !config.analyticsTracker
    ) {
      return;
    }
    // Send metric to custom Analytics service
    config.analyticsTracker({
      metricName: measureName,
      data,
      eventProperties: customProperties || {},
      navigatorInformation: getNavigatorInfo(),
    });
  });
};
