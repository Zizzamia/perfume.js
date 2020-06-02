export interface IAnalyticsTrackerOptions {
  metricName: string;
  data: IPerfumeData;
  eventProperties: object;
  navigatorInformation: INavigatorInfo;
}

export interface IPerfumeConfig {
  // Metrics
  isResourceTiming: boolean;
  isElementTiming: boolean;
  // Analytics
  analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
  // Logging
  maxTime: number;
}

export interface IPerfumeOptions {
  // Metrics
  resourceTiming?: boolean;
  elementTiming?: boolean;
  // Analytics
  analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
  // Logging
  maxMeasureTime?: number;
}

export interface IMetricMap {
  [measureName: string]: boolean;
}

export interface INavigatorInfo {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  isLowEndDevice?: boolean;
  isLowEndExperience?: boolean;
  serviceWorkerStatus?: 'controlled' | 'supported' | 'unsupported';
}

export interface IPerfObservers {
  [measureName: string]: any;
}

export type IPerformanceObserverType =
  | 'first-input'
  | 'largest-contentful-paint'
  | 'layout-shift'
  | 'longtask'
  | 'measure'
  | 'navigation'
  | 'paint'
  | 'element'
  | 'resource';

export type IPerformanceEntryInitiatorType =
  | 'beacon'
  | 'css'
  | 'fetch'
  | 'img'
  | 'other'
  | 'script'
  | 'xmlhttprequest';

export declare interface IPerformanceEntry {
  decodedBodySize?: number;
  duration: number;
  entryType: IPerformanceObserverType;
  initiatorType?: IPerformanceEntryInitiatorType;
  loadTime: number;
  name: string;
  renderTime: number;
  startTime: number;
  hadRecentInput?: boolean;
  value?: number;
  identifier?: string;
}

export interface IPerformancePaintTiming {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

export interface IPerfumeNavigationTiming {
  fetchTime?: number;
  workerTime?: number;
  totalTime?: number;
  downloadTime?: number;
  timeToFirstByte?: number;
  headerSize?: number;
  dnsLookupTime?: number;
}

export type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g' | 'lte';

export interface IPerfumeNetworkInformation {
  downlink?: number;
  effectiveType?: EffectiveConnectionType;
  onchange?: () => void;
  rtt?: number;
  saveData?: boolean;
}

export interface IPerfumeDataConsumption {
  beacon: number;
  css: number;
  fetch: number;
  img: number;
  other: number;
  script: number;
  total: number;
  xmlhttprequest: number;
}

export type IPerfumeData = number | IPerfumeNavigationTiming | IPerfumeNetworkInformation;
