import { BehaviorSubject } from 'rxjs';

export const navigationTiming = new BehaviorSubject({});
export const fp = new BehaviorSubject(0);
export const fcp = new BehaviorSubject(0);
export const lcp = new BehaviorSubject(0);
export const fid = new BehaviorSubject(0);

// Supports AOT and DI
export function analyticsTracker({ metricName, data, duration }) {
  console.log(`Analytics ${metricName}`, data);
  switch(metricName) {
    case 'navigationTiming':
      navigationTiming.next(data);
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
  }
}
export const PerfumeConfig = {
  firstPaint: true,
  firstContentfulPaint: true,
  firstInputDelay: true,
  dataConsumption: true,
  largestContentfulPaint: true,
  navigationTiming: true,
  analyticsTracker,
  browserTracker: true,
  debugging: true,
};
