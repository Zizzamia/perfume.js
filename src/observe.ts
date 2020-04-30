import { config } from './config';
import { initLayoutShift } from './cumulativeLayoutShift';
import { initFirstInputDelay } from './firstInput';
import { logMetric } from './log';
import { cls, clsMetricName, lcp, lcpMetricName } from './metrics';
import { perfObservers } from './observeInstances';
import { initFirstPaint, initLargestContentfulPaint } from './paint';
import { po, poDisconnect } from './performanceObserver';
import { initResourceTiming } from './resourceTiming';

export const initPerformanceObserver = () => {
  perfObservers[0] = po('paint', initFirstPaint);
  // FID needs to be initialized as soon as Perfume is available
  // DataConsumption resolves after FID is triggered
  perfObservers[1] = po('first-input', initFirstInputDelay);
  perfObservers[2] = po(
    'largest-contentful-paint',
    initLargestContentfulPaint,
  );
  // Collects KB information related to resources on the page
  if (config.isResourceTiming) {
    po('resource', initResourceTiming);
  }
  perfObservers[3] = po('layout-shift', initLayoutShift);
};

export const disconnectPerfObserversHidden = () => {
  if (perfObservers[2]) {
    logMetric(lcp.value, `${lcpMetricName}Final`);
    poDisconnect(2);
  }
  if (perfObservers[3]) {
    perfObservers[3].takeRecords();
    logMetric(cls.value, `${clsMetricName}Final`);
    poDisconnect(3);
  }
};
