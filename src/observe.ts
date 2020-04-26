import { config } from './config';
import { initLayoutShift } from './cumulativeLayoutShift';
import { initFirstInputDelay } from './firstInput';
import { logMetric } from './log';
import { cls, clsMetricName, lcp, lcpMetricName } from './metrics';
import { perfObservers } from './observeInstances';
import { initFirstPaint, initLargestContentfulPaint } from './paint';
import { po } from './performanceObserver';
import { initResourceTiming } from './resourceTiming';

export const initPerformanceObserver = () => {
  perfObservers.fcp = po('paint', initFirstPaint);
  // FID needs to be initialized as soon as Perfume is available
  // DataConsumption resolves after FID is triggered
  perfObservers.fid = po('first-input', initFirstInputDelay);
  perfObservers.lcp = po(
    'largest-contentful-paint',
    initLargestContentfulPaint,
  );
  // Collects KB information related to resources on the page
  if (config.isResourceTiming) {
    po('resource', initResourceTiming);
  }
  perfObservers.cls = po('layout-shift', initLayoutShift);
};

export const disconnectPerfObserversHidden = () => {
  if (perfObservers.lcp) {
    logMetric(lcp.value, `${lcpMetricName}UntilHidden`);
    perfObservers.lcp.disconnect();
  }
  if (perfObservers.cls) {
    perfObservers.cls.takeRecords();
    logMetric(cls.value, `${clsMetricName}UntilHidden`, '');
    perfObservers.cls.disconnect();
  }
};
