import { BehaviorSubject } from 'rxjs';

export const navigationTiming = new BehaviorSubject({});
export const networkInformation = new BehaviorSubject({});
export const resourceTiming = new BehaviorSubject({});
export const dataConsumption = new BehaviorSubject({});
export const fp = new BehaviorSubject(0);
export const fcp = new BehaviorSubject(0);
export const lcp = new BehaviorSubject(0);
export const fid = new BehaviorSubject(0);
export const fibonacci = new BehaviorSubject(0);
export const custom_fibonacci = new BehaviorSubject(0);
export const openDialog$ = new BehaviorSubject(0);

// Supports AOT and DI
export function analyticsTracker({ metricName, data, duration }) {
  switch(metricName) {
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
      fp.next(duration);
      break;
    case 'firstContentfulPaint':
      fcp.next(duration);
      break;
    case 'largestContentfulPaint':
      lcp.next(duration);
      break;
    case 'firstInputDelay':
      fid.next(duration);
      break;
    case 'fibonacci':
      fibonacci.next(duration);
      break;
    case 'custom_fibonacci':
      custom_fibonacci.next(duration);
      break;
    case 'openDialog':
      openDialog$.next(duration);
      break;
  }
}

export const PerfumeConfig = {
  firstPaint: true,
  firstContentfulPaint: true,
  firstInputDelay: true,
  dataConsumption: true,
  largestContentfulPaint: true,
  navigationTiming: true,
  networkInformation: true,
  resourceTiming: true,
  analyticsTracker,
};
