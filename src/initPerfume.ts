/**
 * Perfume.js v9.0.0-rc.3 (http://zizzamia.github.io/perfume)
 * Copyright 2022 Leonardo Zizzamia (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 *
 * @license
 */
import { config } from './config';
import { W, WN } from './constants';
import { getNavigationTiming } from './getNavigationTiming';
import { getNetworkInformation } from './getNetworkInformation';
import { isPerformanceSupported } from './isSupported';
import { logData, logMetric } from './log';
import { initPerformanceObserver } from './observe';
import { didVisibilityChange } from './onVisibilityChange';
import { reportStorageEstimate } from './storageEstimate';
import { IPerfumeOptions } from './types';
import { getVitalsScore } from './vitalsScore';
import { setStepsMap } from './steps/setStepsMap';

export const initPerfume = (options: IPerfumeOptions = {}) => {
  // Extend default config with external options
  config.analyticsTracker = options.analyticsTracker;
  config.isResourceTiming = !!options.resourceTiming;
  config.isElementTiming = !!options.elementTiming;
  config.maxTime = options.maxMeasureTime || config.maxTime;
  config.reportOptions = options.reportOptions || config.reportOptions;
  config.steps = options.steps;
  config.onMarkStep = options.onMarkStep;

  // Exit from Perfume when basic Web Performance APIs aren't supported
  if (!isPerformanceSupported()) {
    return;
  }
  // Checks if use Performance or the EmulatedPerformance instance
  if ('PerformanceObserver' in W) {
    initPerformanceObserver();
  }

  // Init visibilitychange listener
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    document.addEventListener('visibilitychange', didVisibilityChange);
  }

  const navigationTiming = getNavigationTiming();
  // Log Navigation Timing
  logData('navigationTiming', navigationTiming);
  if (navigationTiming.redirectTime) {
    logMetric({
      attribution: {},
      name: `RT`,
      rating: getVitalsScore('RT', navigationTiming.redirectTime),
      value: navigationTiming.redirectTime,
    });
  }
  // Log Network Information
  logData('networkInformation', getNetworkInformation());
  // Let's estimate our storage capacity
  if (WN && WN.storage && typeof WN.storage.estimate === 'function') {
    WN.storage.estimate().then(reportStorageEstimate);
  }
  // initializing Steps if present
  if (config.steps) {
    setStepsMap();
  }
};
