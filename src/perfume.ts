/*!
 * Perfume.js v5.0.0-rc.11 (http://zizzamia.github.io/perfume)
 * Copyright 2020 Leonardo Zizzamia (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import { IMetricMap, IPerfumeOptions } from './types';

import { config } from './config';
import { WP } from './constants';
import { getNavigationTiming } from './getNavigationTiming';
import { getNavigatorInfo } from './getNavigatorInfo';
import { getNetworkInformation } from './getNetworkInformation';
import {
  isPerformanceObserverSupported,
  isPerformanceSupported,
} from './isSupported';
import { log, logData, logWarn } from './log';
import { performanceMeasure } from './measure';
import {
  disconnectPerfObserversHidden,
  initPerformanceObserver,
} from './observe';
import { onVisibilityChange, visibility } from './onVisibilityChange';
import { reportPerf } from './reportPerf';
import { initStorageEstimate } from './storageEstimate';
import { pushTask } from './utils';

const logPrefixRecording = 'Recording already';

export default class Perfume {
  copyright = '© 2020 Leonardo Zizzamia';
  version = '5.0.0-rc.11';
  private metrics: IMetricMap = {};

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    config.isResourceTiming = !!options.resourceTiming;
    config.loggingPrefix = options.logPrefix || config.loggingPrefix;
    config.isLogging = !!options.logging;
    config.maxTime = options.maxMeasureTime || config.maxTime;

    // Exit from Perfume when basic Web Performance APIs aren't supported
    if (!isPerformanceSupported()) {
      return;
    }
    // Checks if use Performance or the EmulatedPerformance instance
    if (isPerformanceObserverSupported()) {
      initPerformanceObserver();
    }

    // Init visibilitychange listener
    onVisibilityChange(disconnectPerfObserversHidden);
    // Log Navigation Timing
    logData('navigationTiming', getNavigationTiming());
    // Log Network Information
    logData('networkInformation', getNetworkInformation());
    // Let's estimate our storage capacity
    initStorageEstimate();
  }

  /**
   * Start performance measurement
   */
  start(markName: string): void {
    if (!isPerformanceSupported()) {
      return;
    }
    if (this.metrics[markName]) {
      logWarn(`${logPrefixRecording} started.`);
      return;
    }
    this.metrics[markName] = true;
    // Creates a timestamp in the browser's performance entry buffer
    WP.mark(`mark_${markName}_start`);
    // Reset hidden value
    visibility.isHidden = false;
  }

  /**
   * End performance measurement
   */
  end(markName: string, customProperties = {}): void {
    if (!isPerformanceSupported()) {
      return;
    }
    if (!this.metrics[markName]) {
      logWarn(`${logPrefixRecording} stopped.`);
      return;
    }
    // End Performance Mark
    WP.mark(`mark_${markName}_end`);
    // Get duration and change it to a two decimal value
    const durationByMetric = performanceMeasure(markName);
    const duration2Decimal = parseFloat(durationByMetric.toFixed(2));
    delete this.metrics[markName];
    pushTask(() => {
      const options = {
        measureName: markName,
        data: duration2Decimal,
        customProperties,
        navigatorInfo: getNavigatorInfo(),
      };
      // Log to console, delete metric and send to analytics tracker
      log(options);
      reportPerf(options);
    });
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
    delete this.metrics[markName];
    // Mobile Safari v13 and UC Browser v11
    // don't support clearMarks yet
    if (!WP.clearMarks) {
      return;
    }
    WP.clearMarks(`mark_${markName}_start`);
    WP.clearMarks(`mark_${markName}_end`);
  }
}
