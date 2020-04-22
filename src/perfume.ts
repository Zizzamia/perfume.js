/*!
 * Perfume.js v5.0.0-rc.6 (http://zizzamia.github.io/perfume)
 * Copyright 2020 Leonardo Zizzamia (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import {
  ILogOptions,
  IMetricMap,
  INavigatorInfo,
  IPerfObservers,
  IPerformanceEntry,
  IPerformanceObserver,
  IPerformanceObserverEntryList,
  IPerformanceObserverType,
  IPerfumeConfig,
  IPerfumeDataConsumption,
  IPerfumeMetrics,
  IPerfumeOptions,
  ISendTimingOptions,
} from './types';

import { C, D, W, WN, WP } from './constants';
import { getNavigationTiming } from './getNavigationTiming';
import { et, sd, getNetworkInformation } from './getNetworkInformation';
import { getIsLowEndDevice, getIsLowEndExperience } from './isLowEnd';
import { isPerformanceSupported, isPerformanceObserverSupported } from './isSupported';

// Have private variable outside the class,
// helps reduce the library size
let fcp = 0;
let clsScore = 0;
let lcp = 0;

export default class Perfume {
  config: IPerfumeConfig = {
    // Metrics
    dataConsumption: false,
    resourceTiming: false,
    // Logging
    logPrefix: 'Perfume.js:',
    logging: true,
    maxMeasureTime: 15000,
  };
  copyright = '© 2020 Leonardo Zizzamia';
  version = '5.0.0-rc.6';
  private dataConsumptionTimeout: any;
  private isHidden: boolean = false;
  private logPrefixRecording = 'Recording already';
  private metrics: IMetricMap = {};
  private perfObserver: any;
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
    this.config = Object.assign({}, this.config, options) as IPerfumeConfig;

    // Exit from Perfume when basic Web Performance APIs aren't supported
    if (!isPerformanceSupported()) {
      return;
    }
    // Checks if use Performance or the EmulatedPerformance instance
    if (isPerformanceObserverSupported()) {
      try {
        this.initPerformanceObserver();
      } catch (e) {
        this.logWarn(e);
      }
    }

    // Init visibilitychange listener
    this.onVisibilityChange();
    // Log Navigation Timing
    this.logData('navigationTiming', getNavigationTiming());
    // Log Network Information
    this.logData('networkInformation', getNetworkInformation());
    // Let's estimate our storage capacity
    this.initStorageEstimate();
  }

  /**
   * Start performance measurement
   */
  start(markName: string): void {
    if (!isPerformanceSupported()) {
      return;
    }
    if (this.metrics[markName]) {
      this.logWarn(`${this.logPrefixRecording} started.`);
      return;
    }
    this.metrics[markName] = true;
    // Creates a timestamp in the browser's performance entry buffer
    WP.mark(`mark_${markName}_start`);
    // Reset hidden value
    this.isHidden = false;
  }

  /**
   * End performance measurement
   */
  end(markName: string, customProperties = {}): void {
    if (!isPerformanceSupported()) {
      return;
    }
    if (!this.metrics[markName]) {
      this.logWarn(`${this.logPrefixRecording} stopped.`);
      return;
    }
    // End Performance Mark
    WP.mark(`mark_${markName}_end`);
    // Get duration and change it to a two decimal value
    const durationByMetric = this.performanceMeasure(markName);
    const duration2Decimal = parseFloat(durationByMetric.toFixed(2));
    delete this.metrics[markName];
    this.pushTask(() => {
      const navigatorInfo = this.getNavigatorInfo();
      navigatorInfo.isLowEndDevice = getIsLowEndDevice();
      navigatorInfo.isLowEndExperience = getIsLowEndExperience(et, sd);
      const options = {
        measureName: markName,
        data: duration2Decimal,
        customProperties,
        navigatorInfo,
      };
      // Log to console, delete metric and send to analytics tracker
      this.log(options);
      this.sendTiming(options);
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

  private convertToKB(bytes: number): number | null {
    if (typeof bytes !== 'number') {
      return null;
    }
    return parseFloat((bytes / Math.pow(1024, 2)).toFixed(2));
  }

  private didVisibilityChange() {
    if (D.hidden) {
      this.disconnectPerfObserversHidden();
      this.isHidden = D.hidden;
    }
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
    this.logData('dataConsumption', this.perfResourceTiming);
  }

  private disconnectPerfObservers(
    lcpValue: number,
    clsScoreValue: number,
  ): void {
    if (this.perfObservers.lcp && lcpValue) {
      this.logMetric(lcpValue, 'largestContentfulPaint');
    }
    if (this.perfObservers.cls && clsScoreValue > 0) {
      this.perfObservers.cls.takeRecords();
      this.logMetric(clsScoreValue, 'cumulativeLayoutShift', '');
    }
    // TBT by FID
    if (this.perfObservers.tbt && this.totalBlockingTimeScore) {
      this.logMetric(this.totalBlockingTimeScore, 'totalBlockingTime');
    }
  }

  private disconnectPerfObserversHidden(): void {
    if (this.perfObservers.lcp && lcp) {
      this.logMetric(lcp, 'largestContentfulPaintUntilHidden');
      this.perfObservers.lcp.disconnect();
    }
    if (this.perfObservers.cls && clsScore > 0) {
      this.perfObservers.cls.takeRecords();
      this.logMetric(clsScore, 'cumulativeLayoutShiftUntilHidden', '');
      this.perfObservers.cls.disconnect();
    }
  }

  private disconnecTotalBlockingTime(): void {
    // TBT with 5 second delay after FID
    setTimeout(() => {
      if (this.perfObservers.tbt && this.totalBlockingTimeScore) {
        this.logMetric(this.totalBlockingTimeScore, 'totalBlockingTime5S');
      }
    }, 5000);
    // TBT with 10 second delay after FID
    setTimeout(() => {
      if (this.perfObservers.tbt) {
        if (this.totalBlockingTimeScore) {
          this.logMetric(this.totalBlockingTimeScore, 'totalBlockingTime10S');
        }
        this.perfObservers.tbt.disconnect();
      }
    }, 10000);
  }

  private initFirstInputDelay(): void {
    this.perfObservers.fid = this.performanceObserver(
      'first-input',
      this.digestFirstInputDelayEntries.bind(this),
    );
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  private initFirstPaint(): void {
    this.perfObservers.fcp = this.performanceObserver(
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
    this.perfObservers.lcp = this.performanceObserver(
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
    this.perfObservers.cls = this.performanceObserver(
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
    if (this.config.resourceTiming || this.config.dataConsumption) {
      this.initResourceTiming();
    }
    this.initLayoutShift();
  }

  private initResourceTiming(): void {
    this.performanceObserver(
      'resource',
      (performanceEntries: IPerformanceEntry[]) => {
        this.performanceObserverResourceCb({
          performanceEntries,
        });
      },
    );
    this.dataConsumptionTimeout = setTimeout(() => {
      this.disconnectDataConsumption();
    }, 15000);
  }

  private initTotalBlockingTime(): void {
    this.perfObservers.tbt = this.performanceObserver(
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

  /**
   * Information coming from window.navigator:
   * 1. Device Memory
   * 2. Hardware Concurency
   * 3. Status of the service worker:
   *     - controlled: a service worker is controlling the page
   *     - supported: the browser supports service worker
   *     - unsupported: the user's browser does not support service worker
   */
  private getNavigatorInfo(): INavigatorInfo {
    if (WN) {
      return {
        deviceMemory: (WN as any).deviceMemory ? (WN as any).deviceMemory : 0,
        hardwareConcurrency: (WN as any).hardwareConcurrency
          ? (WN as any).hardwareConcurrency
          : 0,
        serviceWorkerStatus:
          'serviceWorker' in WN
            ? WN.serviceWorker.controller
              ? 'controlled'
              : 'supported'
            : 'unsupported',
      };
    }
    return {};
  }

  private logData(measureName: string, data: any): void {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'number') {
        data[key] = parseFloat(data[key].toFixed(2));
      }
    });
    const navigatorInfo = this.getNavigatorInfo();
    navigatorInfo.isLowEndDevice = getIsLowEndDevice();
    navigatorInfo.isLowEndExperience = getIsLowEndExperience(et, sd);
    this.pushTask(() => {
      // Logs the metric in the internal console.log
      this.log({ measureName, data, navigatorInfo });
      // Sends the metric to an external tracking service
      this.sendTiming({ measureName, data, navigatorInfo });
    });
  }

  /**
   * Dispatches the metric duration into internal logs
   * and the external time tracking service.
   */
  private logMetric(
    duration: number,
    measureName: string,
    suffix: string = 'ms',
  ): void {
    const duration2Decimal = parseFloat(duration.toFixed(2));
    // Stop Analytics and Logging for false negative metrics
    if (
      duration2Decimal > this.config.maxMeasureTime ||
      duration2Decimal <= 0
    ) {
      return;
    }
    const navigatorInfo = this.getNavigatorInfo();
    navigatorInfo.isLowEndDevice = getIsLowEndDevice();
    navigatorInfo.isLowEndExperience = getIsLowEndExperience(et, sd);
    this.pushTask(() => {
      // Logs the metric in the internal console.log
      this.log({
        measureName,
        data: `${duration2Decimal} ${suffix}`,
        navigatorInfo,
      });
      // Sends the metric to an external tracking service
      this.sendTiming({
        measureName,
        data: duration2Decimal,
        navigatorInfo,
      });
    });
  }

  /**
   * Coloring Text in Browser Console
   */
  private log(options: ILogOptions): void {
    // Don't log when page is hidden or has disabled logging
    if (
      (this.isHidden && options.measureName.indexOf('Hidden') < 0) ||
      !this.config.logging
    ) {
      return;
    }
    const style = 'color:#ff6d00;font-size:11px;';
    C.log(
      `%c ${this.config.logPrefix} ${options.measureName} `,
      style,
      options.data,
      options.navigatorInfo,
    );
  }

  /**
   * Ensures console.warn exist and logging is enable for
   * warning messages
   */
  private logWarn(message: string): void {
    if (!this.config.logging) {
      return;
    }
    C.warn(this.config.logPrefix, message);
  }

  /**
   * From visibilitychange listener it saves only when
   * the page gets hidden, because it's important to not
   * use the wrong "hidden" value when send timing or logging.
   */
  private onVisibilityChange() {
    if (typeof D.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      D.addEventListener(
        'visibilitychange',
        this.didVisibilityChange.bind(this),
      );
    }
  }

  private performanceMeasure(measureName: string): number {
    const startMark = `mark_${measureName}_start`;
    const endMark = `mark_${measureName}_end`;
    WP.measure(measureName, startMark, endMark);
    return this.getDurationByMetric(measureName);
  }

  /**
   * PerformanceObserver subscribes to performance events as they happen
   * and respond to them asynchronously.
   */
  private performanceObserver(
    eventType: IPerformanceObserverType,
    cb: (performanceEntries: any[]) => void,
  ): IPerformanceObserver {
    this.perfObserver = new PerformanceObserver(
      (entryList: IPerformanceObserverEntryList) => {
        const performanceEntries = entryList.getEntries();
        cb(performanceEntries);
      },
    );
    // Retrieve buffered events and subscribe to newer events for Paint Timing
    this.perfObserver.observe({ type: eventType, buffered: true });
    return this.perfObserver;
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
      (performanceEntry: IPerformanceEntry) => {
        if (
          !options.entryName ||
          (options.entryName && performanceEntry.name === options.entryName)
        ) {
          this.logMetric(
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
        if (this.config.resourceTiming) {
          this.logData('resourceTiming', performanceEntry);
        }
        if (
          this.config.dataConsumption &&
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

  /**
   * PushTask to requestIdleCallback
   */
  private pushTask(cb: any): void {
    if ('requestIdleCallback' in W) {
      (W as any).requestIdleCallback(cb, { timeout: 3000 });
    } else {
      cb();
    }
  }

  /**
   * Sends the User timing measure to analyticsTracker
   */
  private sendTiming(options: ISendTimingOptions): void {
    // Doesn't send timing when page is hidden
    if (
      (this.isHidden && options.measureName.indexOf('Hidden') < 0) ||
      !this.config.analyticsTracker
    ) {
      return;
    }
    const { measureName, data, customProperties, navigatorInfo } = options;
    const eventProperties = customProperties ? customProperties : {};
    // Send metric to custom Analytics service
    this.config.analyticsTracker({
      metricName: measureName,
      data,
      eventProperties,
      navigatorInformation: navigatorInfo,
    });
  }

  /**
   * The estimate() method of the StorageManager interface asks the Storage Manager
   * for how much storage the app takes up (usage),
   * and how much space is available (quota).
   */
  private initStorageEstimate() {
    if (!WN || !WN.storage) {
      return;
    }
    WN.storage.estimate().then(storageInfo => {
      let estimateUsageDetails: any = {};
      if ('usageDetails' in storageInfo) {
        estimateUsageDetails = (storageInfo as any).usageDetails;
      }
      this.logData('storageEstimate', {
        storageEstimateQuota: this.convertToKB((storageInfo as any).quota),
        storageEstimateUsage: this.convertToKB((storageInfo as any).usage),
        storageEstimateCaches: this.convertToKB(estimateUsageDetails.caches),
        storageEstimateIndexedDB: this.convertToKB(
          estimateUsageDetails.indexedDB,
        ),
        storageEstimatSW: this.convertToKB(
          estimateUsageDetails.serviceWorkerRegistrations,
        ),
      });
    });
  }
}
