import { config } from './config';
import { C } from './constants';
import { getNavigatorInfo } from './getNavigatorInfo';
import { et, sd } from './getNetworkInformation';
import { getIsLowEndDevice, getIsLowEndExperience } from './isLowEnd';
import { visibility } from './onVisibilityChange';
import { reportPerf } from './reportPerf';
import { ILogOptions } from './types';
import { pushTask } from './utils';

/**
 * Coloring Text in Browser Console
 */
export const log = (options: ILogOptions): void => {
  // Don't log when page is hidden or has disabled logging
  if (
    (visibility.isHidden && options.measureName.indexOf('Hidden') < 0) ||
    !config.logging
  ) {
    return;
  }
  C.log(
    `%c ${config.logPrefix} ${options.measureName} `,
    'color:#ff6d00;font-size:11px;',
    options.data,
    options.navigatorInfo,
  );
};

export const logData = (measureName: string, data: any): void => {
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'number') {
      data[key] = parseFloat(data[key].toFixed(2));
    }
  });
  const navigatorInfo = getNavigatorInfo();
  navigatorInfo.isLowEndDevice = getIsLowEndDevice();
  navigatorInfo.isLowEndExperience = getIsLowEndExperience(et, sd);
  pushTask(() => {
    // Logs the metric in the internal console.log
    log({ measureName, data, navigatorInfo });
    // Sends the metric to an external tracking service
    reportPerf({ measureName, data, navigatorInfo });
  });
};

/**
 * Ensures console.warn exist and logging is enable for
 * warning messages
 */
export const logWarn = (message: string): void => {
  if (!config.logging) {
    return;
  }
  C.warn(config.logPrefix, message);
};
