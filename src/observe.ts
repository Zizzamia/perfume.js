import {
  onCLS,
  onFCP,
  onFID,
  onLCP
} from 'web-vitals/attribution';

import { config } from './config';
import { initElementTiming } from './element-timing';
import { logMetric } from './log';
import { po } from './performanceObserver';
import { initResourceTiming } from './resourceTiming';

export const initPerformanceObserver = (): void => {
  onCLS((report) => logMetric(report));
  onFCP((report) => logMetric(report));
  onFID((report) => logMetric(report));
  onLCP((report) => logMetric(report));

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
