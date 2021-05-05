import { config } from './config';
import { reportPerf } from './reportPerf';
import { roundByFour } from './utils';

export const logData = (
  measureName: string,
  metric: any,
  customProperties?: object,
): void => {
  Object.keys(metric).forEach(key => {
    if (typeof metric[key] === 'number') {
      metric[key] = roundByFour(metric[key]);
    }
  });
  // Sends the metric to an external tracking service
  reportPerf(measureName, metric, customProperties);
};

/**
 * Dispatches the metric duration into internal logs
 * and the external time tracking service.
 */
export const logMetric = (duration: number, measureName: string, customProperties?: object): void => {
  const duration2Decimal = roundByFour(duration);
  if (duration2Decimal <= config.maxTime && duration2Decimal >= 0) {
    // Sends the metric to an external tracking service
    reportPerf(measureName, duration2Decimal, customProperties);
  }
};
