import {
  onCLS,
  onFCP,
  onFID,
  onINP,
  onLCP,
  onTTFB
} from 'web-vitals/attribution';

import { config } from './config';
import { initElementTiming } from './element-timing';
import { logMetric } from './log';
import { po } from './performanceObserver';
import { initResourceTiming } from './resourceTiming';

export const initPerformanceObserver = (): void => {
  // @ts-ignore
  onTTFB((report) => {
    // Calculate the request time by subtracting from TTFB
    // everything that happened prior to the request starting.
    // @ts-ignore
    report.value = report.value - report.entries[0].requestStart;
    // @ts-ignore
    logMetric(report);
  });
  // @ts-ignore
  onCLS((report) => logMetric(report));
  // @ts-ignore
  onFCP((report) => logMetric(report));
  // @ts-ignore
  onFID((report) => logMetric(report));
  // @ts-ignore
  onLCP((report) => logMetric(report));
  // @ts-ignore
  onINP((report) => logMetric(report));

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
