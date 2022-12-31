import {
  onCLS,
  onFCP,
  onFID,
  onINP,
  onLCP,
  onTTFB,
} from 'web-vitals/attribution';

import { config } from './config';
import { initElementTiming } from './element-timing';
import { logMetric } from './log';
import { po } from './performanceObserver';
import { initResourceTiming } from './resourceTiming';

export const initPerformanceObserver = (): void => {
  // @ts-ignore
  onTTFB(report => {
    // Calculate the request time by subtracting from TTFB
    // everything that happened prior to the request starting.
    // @ts-ignore
    report.value = report.value - report.entries[0].requestStart;
    // @ts-ignore
    logMetric(report);
  }, config.reportOptions.ttfb);
  // @ts-ignore
  onCLS(report => logMetric(report), config.reportOptions.cls);
  // @ts-ignore
  onFCP(report => logMetric(report), config.reportOptions.fcp);
  // @ts-ignore
  onFID(report => logMetric(report), config.reportOptions.fid);
  // @ts-ignore
  onLCP(report => logMetric(report), config.reportOptions.lcp);
  // @ts-ignore
  onINP(report => logMetric(report), config.reportOptions.inp);

  if (config.isResourceTiming) {
    po('resource', initResourceTiming);
  }
  if (config.isElementTiming) {
    po('element', initElementTiming);
  }
};

export const disconnectPerfObserversHidden = (): void => {
  // TODO: Use if need it
};
