import { BehaviorSubject } from 'rxjs';
// import Perfume from 'perfume.js';
import Perfume from '../../../';

export const navigationTiming = new BehaviorSubject({});
export const networkInformation = new BehaviorSubject({
  effectiveType: '--',
  saveData: '--',
});
export const navigatorInformation$ = new BehaviorSubject({
  deviceMemory: '--',
  hardwareConcurrency: '--',
});
export const resourceTiming = new BehaviorSubject({});
export const dataConsumption = new BehaviorSubject({});
export const fp = new BehaviorSubject(0);
export const fcp = new BehaviorSubject(0);
export const lcp = new BehaviorSubject(0);
export const fid = new BehaviorSubject(0);
export const cls = new BehaviorSubject(0);
export const fibonacci = new BehaviorSubject(0);
export const custom_fibonacci = new BehaviorSubject(0);
export const openDialog$ = new BehaviorSubject(0);
export const isLowEndDevice$ = new BehaviorSubject(false);
export const isLowEndExperience$ = new BehaviorSubject(false);

// Supports AOT and DI
export function analyticsTracker(options) {
  const { metricName, data, navigatorInformation } = options;
  if (navigatorInformation && navigatorInformation.deviceMemory) {
    navigatorInformation$.next(navigatorInformation);
    isLowEndDevice$.next(navigatorInformation.isLowEndDevice);
    isLowEndExperience$.next(navigatorInformation.isLowEndExperience);
  }
  switch (metricName) {
    case 'navigationTiming':
      navigationTiming.next(data);
      break;
    case 'networkInformation':
      networkInformation.next(data);
      break;
    case 'resourceTiming':
      resourceTiming.next(data);
      break;
    case 'dataConsumption':
      dataConsumption.next(data);
      break;
    case 'firstPaint':
      fp.next(data);
      break;
    case 'firstContentfulPaint':
      fcp.next(data);
      break;
    case 'largestContentfulPaint':
      lcp.next(data);
      break;
    case 'firstInputDelay':
      fid.next(data);
      break;
    case 'cumulativeLayoutShift':
      cls.next(data);
      break;
    case 'fibonacci':
      fibonacci.next(data);
      break;
    case 'custom_fibonacci':
      custom_fibonacci.next(data);
      break;
    case 'openDialog':
      openDialog$.next(data);
      break;
  }
}

export const PerfumeConfig = {
  cumulativeLayoutShift: true,
  dataConsumption: true,
  resourceTiming: true,
  analyticsTracker,
};

export const perfume = new Perfume(PerfumeConfig);
