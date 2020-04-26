import { config } from './config';
import { C } from './constants';
import { getNavigatorInfo } from './getNavigatorInfo';
import { visibility } from './onVisibilityChange';
import { reportPerf } from './reportPerf';
import { ILogOptions } from './types';
import { pushTask, roundByTwo } from './utils';

/**
 * Coloring Text in Browser Console
 */
export const log = (options: ILogOptions): void => {
  // Don't log when page is hidden or has disabled logging
  if (
    (visibility.isHidden && options.measureName.indexOf('Hidden') < 0) ||
    !config.isLogging
  ) {
    return;
  }
  C.log(
    `%c ${config.loggingPrefix} ${options.measureName} `,
    'color:#ff6d00;font-size:11px;',
    options.data,
    options.navigatorInfo,
  );
};

export const logData = (measureName: string, data: any): void => {
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'number') {
      data[key] = roundByTwo(data[key]);
    }
  });
  const navigatorInfo = getNavigatorInfo();
  pushTask(() => {
    // Logs the metric in the internal console.log
    log({ measureName, data, navigatorInfo });
    // Sends the metric to an external tracking service
    reportPerf({ measureName, data, navigatorInfo });
  });
};

/**
 * Dispatches the metric duration into internal logs
 * and the external time tracking service.
 */
export const logMetric = (
  duration: number,
  measureName: string,
  suffix: string = 'ms',
) => {
  const duration2Decimal = roundByTwo(duration);
  // Stop Analytics and Logging for false negative metrics
  if (duration2Decimal > config.maxTime || duration2Decimal <= 0) {
    return;
  }
  const navigatorInfo = getNavigatorInfo();
  pushTask(() => {
    // Logs the metric in the internal console.log
    log({
      measureName,
      data: `${duration2Decimal} ${suffix}`,
      navigatorInfo,
    });
    // Sends the metric to an external tracking service
    reportPerf({
      measureName,
      data: duration2Decimal,
      navigatorInfo,
    });
  });
};

/**
 * Ensures console.warn exist and logging is enable for
 * warning messages
 */
export const logWarn = (message: string): void => {
  if (!config.isLogging) {
    return;
  }
  C.warn(config.loggingPrefix, message);
};
