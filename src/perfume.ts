/**
 * Perfume.js v8.4.0 (http://zizzamia.github.io/perfume)
 * Copyright 2022 Leonardo Zizzamia (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 *
 * @license
 */
import { config } from './config';
import { W, WN, WP } from './constants';
import { getNavigationTiming } from './getNavigationTiming';
import { getNetworkInformation } from './getNetworkInformation';
import { isPerformanceSupported } from './isSupported';
import { logData, logMetric } from './log';
import { performanceMeasure } from './measure';
import { metrics, ntbt } from './metrics';
import { initPerformanceObserver } from './observe';
import { didVisibilityChange } from './onVisibilityChange';
import { reportStorageEstimate } from './storageEstimate';
import { IPerfumeOptions } from './types';
import { roundByFour } from './utils';
import { getVitalsScore } from './vitalsScore';
import {
  setUserJourneyFinalStepsMap,
  setUserJourneyStepsMap,
} from './userJourneyMap';

let ntbtTimeoutID = 0;

export default class Perfume {
  v = '8.3.0';

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    config.analyticsTracker = options.analyticsTracker;
    config.isResourceTiming = !!options.resourceTiming;
    config.isElementTiming = !!options.elementTiming;
    config.maxTime = options.maxMeasureTime || config.maxTime;
    config.reportOptions = options.reportOptions || config.reportOptions;
    config.userJourneySteps = options.userJourneySteps;
    config.userJourneys = options.userJourneys;
    config.journeyMaxOutlierThreshold = options.journeyMaxOutlierThreshold;
    config.onMarkJourney = options.onMarkJourney;

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
      document.addEventListener(
        'visibilitychange', didVisibilityChange,
      );
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
    console.log('creating new perfume')
    // initializing User Journeys if present
    if(config.userJourneys && config.userJourneySteps){
      setUserJourneyStepsMap();
      setUserJourneyFinalStepsMap();
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
  }

  /**
   * End performance measurement
   */
  end(markName: string, customProperties = {}, doLogData = true): void {
    if (!isPerformanceSupported() || !metrics[markName]) {
      return;
    }
    // End Performance Mark
    WP.mark(`mark_${markName}_end`);
    delete metrics[markName];
    const measure = performanceMeasure(markName);
    if (doLogData) {
      logData(markName, roundByFour(measure), customProperties);
    }
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

  /**
   * NTBT = Navigation Total Blocking Time
   *
   * This metric measures the amount of time the application may be blocked
   * from processing code during the 2s window after a user navigates
   * from page A to page B.
   *
   * Because this library is navigation agnostic, we have this method
   * to mark when the navigation starts.
   *
   * The NTBT metric is the summation of the blocking time of all long tasks
   * in the 2s window after this method is invoked.
   *
   * If this method is called before the 2s window ends; it will trigger a new
   * NTBT measurement and interrupt the previous one.
   *
   * Credit: Thank you Steven Lam for helping with this!
   */
  markNTBT(): void {
    this.start('ntbt');
    // Reset NTBT value
    ntbt.value = 0;
    clearTimeout(ntbtTimeoutID);
    // @ts-ignore
    ntbtTimeoutID = setTimeout(() => {
      this.end('ntbt', {}, false);
      logMetric({
        attribution: {},
        name: `NTBT`,
        rating: getVitalsScore('NTBT', ntbt.value),
        value: ntbt.value,
      });
      ntbt.value = 0;
    }, 2000);
  }
}
