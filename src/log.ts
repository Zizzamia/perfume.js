import { Metric } from 'web-vitals';

import { config } from './config';
import { rt, tbt } from './metrics';
import { perfObservers } from './observeInstances';
import { po } from './performanceObserver';
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
export const logMetric = ({name, value}: Metric): void => {


  if (['FCP', 'LCP'].includes(name)) {
    perfObservers[4] = po('longtask', initTotalBlockingTime);
  }
  if ('FID' ===name) {
    setTimeout(() => {
      logMetric(tbt.value, 'tbt');
      logData('dataConsumption', rt.value);
    }, 10000);
  }



  const duration2Decimal = roundByFour(value);
  if (duration2Decimal <= config.maxTime && duration2Decimal >= 0) {
    // Sends the metric to an external tracking service
    reportPerf(name, duration2Decimal, customProperties);
  }
};
