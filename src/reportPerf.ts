import { config } from './config';
import { visibility } from './onVisibilityChange';
import { ISendTimingOptions } from './types';

/**
 * Sends the User timing measure to analyticsTracker
 */
export const reportPerf = function(options: ISendTimingOptions): void {
  // Doesn't send timing when page is hidden
  if (
    (visibility.isHidden && options.measureName.indexOf('Final') < 0) ||
    !config.analyticsTracker
  ) {
    return;
  }
  // Send metric to custom Analytics service
  config.analyticsTracker({
    metricName: options.measureName,
    data: options.data,
    eventProperties: options.customProperties ? options.customProperties : {},
    navigatorInformation: options.navigatorInfo,
  });
};
