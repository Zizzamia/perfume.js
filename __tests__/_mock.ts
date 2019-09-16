/* istanbul ignore file */
const entries = [
  { name: 'first-paint', startTime: 1 },
  { name: 'first-contentful-paint', startTime: 1 },
  { name: 'mousedown', duration: 4 },
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

export interface IObserve {
  type: string,
  buffered: boolean
}

export class MockPerformanceObserver {
  static simulateErrorOnObserve = false;

  constructor(cb: any) {
    (this as any).observe = (options: IObserve) => {
      if (MockPerformanceObserver.simulateErrorOnObserve) {
        MockPerformanceObserver.simulateErrorOnObserve = false;
        throw new Error('Simulated Error');
      }
      cb({ getEntries: () => entries });
      return {};
    };
  }
  disconnect() {}
}

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
  PerformanceObserver: MockPerformanceObserver,
  defaultPerfumeConfig: {
    firstContentfulPaint: false,
    firstPaint: false,
    firstInputDelay: false,
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
