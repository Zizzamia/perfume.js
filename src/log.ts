import { config } from './config';

import { reportPerf } from './reportPerf';
import { pushTask, roundByTwo } from './utils';

export const logData = (
  measureName: string,
  metric: any,
  customProperties?: object,
): void => {
  Object.keys(metric).forEach(key => {
    if (typeof metric[key] === 'number') {
      metric[key] = roundByTwo(metric[key]);
    }
  });
  pushTask(() => {
    // Sends the metric to an external tracking service
    reportPerf(measureName, metric, customProperties);
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
  pushTask(() => {
    // Sends the metric to an external tracking service
    reportPerf(measureName, duration2Decimal);
  });
};
