const entries = [
  { name: 'first-paint', startTime: 1 },
  { name: 'first-contentful-paint', startTime: 1 },
];

export const MockDateNowValue = 1537118926087;

export const EventMock = {
  preventDefault: () => {
    return;
  },
  stopPropagation: () => {
    return;
  },
} as Event;

export default {
  Date: {
    now: () => 1000,
  },
  Promise: {
    reject: (x: any) => x,
    resolve: (x: any) => x,
  },
  performance: () => {
    delete (window as any).performance;
    const performance = {
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName
      getEntriesByName: () => [
        { duration: 12345, entryType: 'measure' },
        { duration: 12346, entryType: 'measure' },
      ],
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark
      mark: () => 12345,
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure
      measure: () => 12345,
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
      now: () => MockDateNowValue,
      timing: { navigationStart: 12345 },
    };
    Object.defineProperty(window, 'performance', {
      configurable: true,
      enumerable: true,
      value: performance,
      writable: true,
    });
  },
  perfMetrics: {
    onFirstInputDelay: cb => {
      cb(3.2, EventMock);
    },
  },
  PerformanceLongTaskTiming: {},
  PerformanceObserver: class {
    constructor(cb) {
      (this as any).observe = () => {
        cb({ getEntries: () => entries });
        return {};
      };
    }
    disconnect() {}
  },
  ttiPolyfill: {
    getFirstConsistentlyInteractive: (n: number) => {
      return new Promise(resolve => {
        resolve(n);
      });
    },
  },
  defaultPerfumeConfig: {
    firstContentfulPaint: false,
    firstPaint: false,
    firstInputDelay: false,
    timeToInteractive: false,
    analyticsTracker: undefined,
    googleAnalytics: {
      enable: false,
      timingVar: 'name',
    },
    logPrefix: 'Perfume.js:',
    logging: true,
    warning: false,
  },
  entries,
};
