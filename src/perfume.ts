/*!
 * Perfume.js v5.0.0-rc.9 (http://zizzamia.github.io/perfume)
 * Copyright 2020 Leonardo Zizzamia (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import {
  IMetricMap,
  IPerfObservers,
  IPerformanceEntry,
  IPerfumeDataConsumption,
  IPerfumeMetrics,
  IPerfumeOptions,
} from './types';

import { config } from './config';
import { WP } from './constants';
import { getNavigationTiming } from './getNavigationTiming';
import { getNavigatorInfo } from './getNavigatorInfo';
import { et, getNetworkInformation, sd } from './getNetworkInformation';
import { getIsLowEndDevice, getIsLowEndExperience } from './isLowEnd';
import {
  isPerformanceObserverSupported,
  isPerformanceSupported,
} from './isSupported';
import { log, logData, logMetric, logWarn } from './log';
import { onVisibilityChange, visibility } from './onVisibilityChange';
import { po } from './observe';
import { reportPerf } from './reportPerf';
import { initStorageEstimate } from './storageEstimate';
import { pushTask } from './utils';

// Have private variable outside the class,
// helps reduce the library size
let fcp = 0;
let clsScore = 0;
let lcp = 0;

export default class Perfume {
  copyright = '© 2020 Leonardo Zizzamia';
  version = '5.0.0-rc.9';
  private dataConsumptionTimeout: any;
  private logPrefixRecording = 'Recording already';
  private metrics: IMetricMap = {};
  private perfObservers: IPerfObservers = {};
  private perfResourceTiming: IPerfumeDataConsumption = {
    beacon: 0,
    css: 0,
    fetch: 0,
    img: 0,
    other: 0,
    script: 0,
    total: 0,
    xmlhttprequest: 0,
  };
  private totalBlockingTimeScore = 0;

  constructor(options: IPerfumeOptions = {}) {
    // Extend default config with external options
    config.resourceTiming = !!options.resourceTiming;
    config.logPrefix = options.logPrefix || config.logPrefix;
    config.logging = !!options.logging;
    config.maxMeasureTime = options.maxMeasureTime || config.maxMeasureTime;

    // Exit from Perfume when basic Web Performance APIs aren't supported
    if (!isPerformanceSupported()) {
      return;
    }
    // Checks if use Performance or the EmulatedPerformance instance
    if (isPerformanceObserverSupported()) {
      this.initPerformanceObserver();
    }

    // Init visibilitychange listener
    onVisibilityChange(this.disconnectPerfObserversHidden);
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
      logWarn(`${this.logPrefixRecording} started.`);
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
      logWarn(`${this.logPrefixRecording} stopped.`);
      return;
    }
    // End Performance Mark
    WP.mark(`mark_${markName}_end`);
    // Get duration and change it to a two decimal value
    const durationByMetric = this.performanceMeasure(markName);
    const duration2Decimal = parseFloat(durationByMetric.toFixed(2));
    delete this.metrics[markName];
    pushTask(() => {
      const navigatorInfo = getNavigatorInfo();
      navigatorInfo.isLowEndDevice = getIsLowEndDevice();
      navigatorInfo.isLowEndExperience = getIsLowEndExperience(et, sd);
      const options = {
        measureName: markName,
        data: duration2Decimal,
        customProperties,
        navigatorInfo,
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

  private digestFirstInputDelayEntries(
    performanceEntries: IPerformanceEntry[],
  ): void {
    this.performanceObserverCb({
      performanceEntries,
      measureName: 'firstInputDelay',
      valueLog: 'duration',
    });
    this.disconnectPerfObservers(lcp, clsScore);
    this.disconnectDataConsumption();
    this.disconnecTotalBlockingTime();
  }

  private disconnectDataConsumption(): void {
    if (!this.dataConsumptionTimeout) {
      return;
    }
    clearTimeout(this.dataConsumptionTimeout);
    this.dataConsumptionTimeout = undefined;
    logData('dataConsumption', this.perfResourceTiming);
  }

  private disconnectPerfObservers(
    lcpValue: number,
    clsScoreValue: number,
  ): void {
    if (this.perfObservers.lcp && lcpValue) {
      logMetric(lcpValue, 'largestContentfulPaint');
    }
    if (this.perfObservers.cls && clsScoreValue > 0) {
      this.perfObservers.cls.takeRecords();
      logMetric(clsScoreValue, 'cumulativeLayoutShift', '');
    }
    // TBT by FID
    if (this.perfObservers.tbt && this.totalBlockingTimeScore) {
      logMetric(this.totalBlockingTimeScore, 'totalBlockingTime');
    }
  }

  private disconnectPerfObserversHidden(): void {
    if (this.perfObservers.lcp && lcp) {
      logMetric(lcp, 'largestContentfulPaintUntilHidden');
      this.perfObservers.lcp.disconnect();
    }
    if (this.perfObservers.cls && clsScore > 0) {
      this.perfObservers.cls.takeRecords();
      logMetric(clsScore, 'cumulativeLayoutShiftUntilHidden', '');
      this.perfObservers.cls.disconnect();
    }
  }

  private disconnecTotalBlockingTime(): void {
    // TBT with 5 second delay after FID
    setTimeout(() => {
      if (this.perfObservers.tbt && this.totalBlockingTimeScore) {
        logMetric(this.totalBlockingTimeScore, 'totalBlockingTime5S');
      }
    }, 5000);
    // TBT with 10 second delay after FID
    setTimeout(() => {
      if (this.perfObservers.tbt) {
        if (this.totalBlockingTimeScore) {
          logMetric(this.totalBlockingTimeScore, 'totalBlockingTime10S');
        }
        this.perfObservers.tbt.disconnect();
      }
    }, 10000);
  }

  private initFirstInputDelay(): void {
    this.perfObservers.fid = po(
      'first-input',
      this.digestFirstInputDelayEntries.bind(this),
    );
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  private initFirstPaint(): void {
    this.perfObservers.fcp = po(
      'paint',
      (performanceEntries: IPerformanceEntry[]) => {
        this.performanceObserverCb({
          performanceEntries,
          entryName: 'first-paint',
          measureName: 'firstPaint',
          valueLog: 'startTime',
        });
        this.performanceObserverCb({
          performanceEntries,
          entryName: 'first-contentful-paint',
          measureName: 'firstContentfulPaint',
          valueLog: 'startTime',
        });
      },
    );
  }

  private initLargestContentfulPaint(): void {
    this.perfObservers.lcp = po(
      'largest-contentful-paint',
      (performanceEntries: IPerformanceEntry[]) => {
        const lastEntry = performanceEntries.pop();
        if (lastEntry) {
          lcp = lastEntry.renderTime || lastEntry.loadTime;
        }
      },
    );
  }

  /**
   * Detects new layout shift occurrences and updates the
   * `cumulativeLayoutShiftScore` variable.
   */
  private initLayoutShift(): void {
    this.perfObservers.cls = po(
      'layout-shift',
      (performanceEntries: IPerformanceEntry[]) => {
        const lastEntry = performanceEntries.pop();
        // Only count layout shifts without recent user input.
        if (lastEntry && !lastEntry.hadRecentInput && lastEntry.value) {
          clsScore += lastEntry.value;
        }
      },
    );
  }

  private initPerformanceObserver(): void {
    this.initFirstPaint();
    // FID needs to be initialized as soon as Perfume is available
    // DataConsumption resolves after FID is triggered
    this.initFirstInputDelay();
    this.initLargestContentfulPaint();
    // Collects KB information related to resources on the page
    if (config.resourceTiming) {
      this.initResourceTiming();
    }
    this.initLayoutShift();
  }

  private initResourceTiming(): void {
    po('resource', (performanceEntries: IPerformanceEntry[]) => {
      this.performanceObserverResourceCb({
        performanceEntries,
      });
    });
    this.dataConsumptionTimeout = setTimeout(() => {
      this.disconnectDataConsumption();
    }, 15000);
  }

  private initTotalBlockingTime(): void {
    this.perfObservers.tbt = po(
      'longtask',
      (performanceEntries: IPerformanceEntry[]) => {
        this.performanceObserverTBTCb({
          performanceEntries,
        });
      },
    );
  }

  /**
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made by the User Timing API
   */
  private getDurationByMetric(measureName: string): number {
    const performanceEntries = WP.getEntriesByName(measureName);
    const entry = performanceEntries[performanceEntries.length - 1];
    if (entry && entry.entryType === 'measure') {
      return entry.duration;
    }
    return -1;
  }

  private performanceMeasure(measureName: string): number {
    const startMark = `mark_${measureName}_start`;
    const endMark = `mark_${measureName}_end`;
    WP.measure(measureName, startMark, endMark);
    return this.getDurationByMetric(measureName);
  }

  /**
   * Logging Performance Paint Timing
   */
  private performanceObserverCb(options: {
    performanceEntries: IPerformanceEntry[];
    entryName?: string;
    measureName: IPerfumeMetrics;
    valueLog: 'duration' | 'startTime';
  }): void {
    options.performanceEntries.forEach(
      (performanceEntry) => {
        if (
          !options.entryName ||
          (options.entryName && performanceEntry.name === options.entryName)
        ) {
          logMetric(
            performanceEntry[options.valueLog],
            options.measureName,
          );
        }
        if (
          this.perfObservers.fcp &&
          performanceEntry.name === 'first-contentful-paint'
        ) {
          fcp = performanceEntry.startTime;
          this.initTotalBlockingTime();
          this.perfObservers.fcp.disconnect();
        }
      },
    );
    if (this.perfObservers.fid && options.measureName === 'firstInputDelay') {
      this.perfObservers.fid.disconnect();
    }
  }

  private performanceObserverResourceCb(options: {
    performanceEntries: IPerformanceEntry[];
  }): void {
    options.performanceEntries.forEach(
      (performanceEntry: IPerformanceEntry) => {
        if (config.resourceTiming) {
          logData('resourceTiming', performanceEntry);
        }
        if (
          performanceEntry.decodedBodySize &&
          performanceEntry.initiatorType
        ) {
          const bodySize = performanceEntry.decodedBodySize / 1000;
          this.perfResourceTiming[performanceEntry.initiatorType] += bodySize;
          this.perfResourceTiming.total += bodySize;
        }
      },
    );
  }

  private performanceObserverTBTCb(options: {
    performanceEntries: IPerformanceEntry[];
  }): void {
    options.performanceEntries.forEach(
      (performanceEntry: IPerformanceEntry) => {
        if (
          performanceEntry.name !== 'self' ||
          performanceEntry.startTime < fcp
        ) {
          return;
        }
        const blockingTime = performanceEntry.duration - 50;
        if (blockingTime) {
          this.totalBlockingTimeScore += blockingTime;
        }
      },
    );
  }
}
