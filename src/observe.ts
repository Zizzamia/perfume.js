import { config } from './config';
import { initLayoutShift } from './cumulativeLayoutShift';
import { initFirstInputDelay } from './firstInput';
import { logMetric } from './log';
import { cls, lcp, tbt } from './metrics';
import { perfObservers } from './observeInstances';
import { initFirstPaint, initLargestContentfulPaint, initElementTiming } from './paint';
import { po, poDisconnect } from './performanceObserver';
import { initResourceTiming } from './resourceTiming';

export const initPerformanceObserver = (): void => {
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
  if (config.isElementTiming) {
    po('element', initElementTiming);
  }
};

export const disconnectPerfObserversHidden = (): void => {
  if (perfObservers[2]) {
    logMetric(lcp.value, `lcpFinal`);
    poDisconnect(2);
  }
  if (perfObservers[3]) {
    perfObservers[3].takeRecords();
    logMetric(cls.value, `clsFinal`);
    poDisconnect(3);
  }
  if (perfObservers[4]) {
    logMetric(tbt.value, `tbtFinal`);
    poDisconnect(4);
  }
};
