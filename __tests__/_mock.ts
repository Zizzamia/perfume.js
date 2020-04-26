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
  type: string;
  buffered: boolean;
}

export class MockPerformanceObserver {
  static simulateErrorOnObserve = false;

  constructor(cb: any) {
    (this as any).observe = (options: IObserve) => {
      if (MockPerformanceObserver.simulateErrorOnObserve) {
        MockPerformanceObserver.simulateErrorOnObserve = false;
        throw new Error('Simulated Error');
      }
      cb({ getEntries: () => [...entries] });
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
  navigator: () => {
    delete (window as any).navigator;
    const navigator = {
      connection: {
        effectiveType: '4g',
        rtt: 50,
        downlink: 2.3,
        saveData: false,
      },
      deviceMemory: 8,
      hardwareConcurrency: 12,
      storage: {
        estimate: () =>
          Promise.resolve({
            quota: 10000000,
            usage: 9000000,
            usageDetails: {
              caches: 9000000,
              indexedDB: 9000000,
              serviceWorkerRegistrations: 9000000,
            },
          }),
      },
    };
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      enumerable: true,
      value: navigator,
      writable: true,
    });
    return navigator;
  },
  performance: () => {
    delete (window as any).performance;
    const performance = {
      clearMarks: jest.fn(),
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName
      getEntriesByName: () => [
        { duration: 12345, entryType: 'measure' },
        { duration: 12346, entryType: 'measure' },
      ],
      getEntriesByType: (entryType: string) => {
        if (entryType === 'navigation') {
          return [
            {
              connectEnd: 1.7850000876933336,
              connectStart: 1.7850000876933336,
              decodedBodySize: 0,
              domComplete: 1371.8750001862645,
              domContentLoadedEventEnd: 613.175000064075,
              domContentLoadedEventStart: 613.175000064075,
              domInteractive: 613.1550001446158,
              domainLookupEnd: 1.7850000876933336,
              domainLookupStart: 1.7850000876933336,
              duration: 1378.7500001490116,
              encodedBodySize: 0,
              entryType: 'navigation',
              fetchStart: 1.7850000876933336,
              initiatorType: 'navigation',
              loadEventEnd: 1378.7500001490116,
              loadEventStart: 1378.5850000567734,
              name: 'https://developers.google.com',
              nextHopProtocol: '',
              redirectCount: 0,
              redirectEnd: 0,
              redirectStart: 0,
              requestStart: 1.7850000876933336,
              responseEnd: 6.2200000975281,
              responseStart: 5.530000198632479,
              secureConnectionStart: 0,
              serverTiming: [],
              startTime: 0,
              transferSize: 0,
              type: 'reload',
              unloadEventEnd: 10.075000114738941,
              unloadEventStart: 8.545000106096268,
              workerStart: 1.7850000876933336,
            },
          ];
        }
        return [];
      },
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
    return window.performance;
  },
  PerformanceObserver: MockPerformanceObserver,
  defaultPerfumeConfig: {
    analyticsTracker: jest.fn(),
    logPrefix: 'Perfume.js:',
    logging: true,
  },
  entries,
};
