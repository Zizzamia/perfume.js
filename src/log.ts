import { config } from './config';
import { fcp, rt, tbt } from './metrics';
import { perfObservers } from './observeInstances';
import { po } from './performanceObserver';
import { reportPerf } from './reportPerf';
import { initTotalBlockingTime } from './totalBlockingTime';
import { Metric } from './types';
import { roundByFour } from './utils';
import { getVitalsScore } from './vitalsScore';

export const logData = (
  measureName: string,
  metric: any,
  attribution?: object,
): void => {
  Object.keys(metric).forEach(key => {
    if (typeof metric[key] === 'number') {
      metric[key] = roundByFour(metric[key]);
    }
  });
  // Sends the metric to an external tracking service
  reportPerf(measureName, metric, null, attribution || {});
};

/**
 * Dispatches the metric duration into internal logs
 * and the external time tracking service.
 */
export const logMetric = ({attribution, name, rating, value}: Metric): void => {
  // TODO Add docs
  if (name === 'FCP') {
    fcp.value = value;
  }
  // TODO Add docs
  if (['FCP', 'LCP'].includes(name)) {
    perfObservers[4] = po('longtask', initTotalBlockingTime);
  }
  // TODO Add docs
  if ('FID' ===name) {
    setTimeout(() => {
      logMetric({
        attribution,
        name: 'TBT',
        rating: getVitalsScore('TBT', tbt.value),
        value: tbt.value,
      });
      logData('dataConsumption', rt.value);
    }, 10000);
  }
  // TODO Add docs
  const duration2Decimal = roundByFour(value);
  if (duration2Decimal <= config.maxTime && duration2Decimal >= 0) {
    // Sends the metric to an external tracking service
    reportPerf(name, duration2Decimal, rating, attribution);
  }
};
