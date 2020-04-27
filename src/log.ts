import { config } from './config';
import { getNavigatorInfo } from './getNavigatorInfo';
import { reportPerf } from './reportPerf';
import { pushTask, roundByTwo } from './utils';

export const logData = (measureName: string, data: any): void => {
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'number') {
      data[key] = roundByTwo(data[key]);
    }
  });
  const navigatorInfo = getNavigatorInfo();
  pushTask(() => {
    // Sends the metric to an external tracking service
    reportPerf({ measureName, data, navigatorInfo });
  });
};

/**
 * Dispatches the metric duration into internal logs
 * and the external time tracking service.
 */
export const logMetric = (duration: number, measureName: string) => {
  const duration2Decimal = roundByTwo(duration);
  // Stop Analytics and Logging for false negative metrics
  if (duration2Decimal > config.maxTime || duration2Decimal <= 0) {
    return;
  }
  const navigatorInfo = getNavigatorInfo();
  pushTask(() => {
    // Sends the metric to an external tracking service
    reportPerf({
      measureName,
      data: duration2Decimal,
      navigatorInfo,
    });
  });
};
