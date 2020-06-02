/*!
 * Perfume.js v5.0.2 (http://zizzamia.github.io/perfume)
 * Copyright 2020 Leonardo Zizzamia (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import { config } from './config';
import { D, W, WN, WP } from './constants';
import { getNavigationTiming } from './getNavigationTiming';
import { getNetworkInformation } from './getNetworkInformation';
import { isPerformanceSupported } from './isSupported';
import { logData } from './log';
import { performanceMeasure } from './measure';
import { metrics } from './metrics';
import {
  disconnectPerfObserversHidden,
  initPerformanceObserver,
} from './observe';
import { didVisibilityChange, visibility } from './onVisibilityChange';
import { reportStorageEstimate } from './storageEstimate';
import { IPerfumeOptions } from './types';
import { roundByTwo } from './utils';

export default class Perfume {
  v = '5.0.2';

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    config.analyticsTracker = options.analyticsTracker;
    config.isResourceTiming = !!options.resourceTiming;
    config.isElementTiming = !!options.elementTiming;
    config.maxTime = options.maxMeasureTime || config.maxTime;

    // Exit from Perfume when basic Web Performance APIs aren't supported
    if (!isPerformanceSupported()) {
      return;
    }
    // Checks if use Performance or the EmulatedPerformance instance
    if ('PerformanceObserver' in W) {
      initPerformanceObserver();
    }

    // Init visibilitychange listener
    if (typeof D.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      D.addEventListener(
        'visibilitychange',
        didVisibilityChange.bind(this, disconnectPerfObserversHidden),
      );
    }
    // Log Navigation Timing
    logData('navigationTiming', getNavigationTiming());
    // Log Network Information
    logData('networkInformation', getNetworkInformation());
    // Let's estimate our storage capacity
    if (WN && WN.storage) {
      WN.storage.estimate().then(reportStorageEstimate);
    }
  }

  /**
   * Start performance measurement
   */
  start(markName: string): void {
    if (!isPerformanceSupported() || metrics[markName]) {
      return;
    }
    metrics[markName] = true;
    // Creates a timestamp in the browser's performance entry buffer
    WP.mark(`mark_${markName}_start`);
    // Reset hidden value
    visibility.isHidden = false;
  }

  /**
   * End performance measurement
   */
  end(markName: string, customProperties = {}): void {
    if (!isPerformanceSupported() || !metrics[markName]) {
      return;
    }
    // End Performance Mark
    WP.mark(`mark_${markName}_end`);
    delete metrics[markName];
    logData(
      markName,
      roundByTwo(performanceMeasure(markName)),
      customProperties,
    );
  }

  /**
   * End performance measurement after first paint from the beging of it
   */
  endPaint(markName: string, customProperties?: object): void {
    setTimeout(() => {
      this.end(markName, customProperties);
    });
  }

  /**
   * Removes the named mark from the browser's performance entry buffer.
   */
  clear(markName: string): void {
    delete metrics[markName];
    // Mobile Safari v13 and UC Browser v11
    // don't support clearMarks yet
    if (!WP.clearMarks) {
      return;
    }
    WP.clearMarks(`mark_${markName}_start`);
    WP.clearMarks(`mark_${markName}_end`);
  }
}
