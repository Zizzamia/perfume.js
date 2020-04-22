import { WP } from './constants';
import { isPerformanceSupported } from './isSupported';
import { IPerfumeNavigationTiming } from './types';

/**
 * Navigation Timing API provides performance metrics for HTML documents.
 * w3c.github.io/navigation-timing/
 * developers.google.com/web/fundamentals/performance/navigation-and-resource-timing
 */
export const getNavigationTiming = (): IPerfumeNavigationTiming => {
  if (!isPerformanceSupported()) {
    return {};
  }
  // There is an open issue to type correctly getEntriesByType
  // github.com/microsoft/TypeScript/issues/33866
  const n = WP.getEntriesByType('navigation')[0] as any;
  // In Safari version 11.2 Navigation Timing isn't supported yet
  if (!n) {
    return {};
  }
  const responseStart = n.responseStart;
  const responseEnd = n.responseEnd;
  // We cache the navigation time for future times
  return {
    // fetchStart marks when the browser starts to fetch a resource
    // responseEnd is when the last byte of the response arrives
    fetchTime: responseEnd - n.fetchStart,
    // Service worker time plus response time
    workerTime: n.workerStart > 0 ? responseEnd - n.workerStart : 0,
    // Request plus response time (network only)
    totalTime: responseEnd - n.requestStart,
    // Response time only (download)
    downloadTime: responseEnd - responseStart,
    // Time to First Byte (TTFB)
    timeToFirstByte: responseStart - n.requestStart,
    // HTTP header size
    headerSize: n.transferSize - n.encodedBodySize || 0,
    // Measuring DNS lookup time
    dnsLookupTime: n.domainLookupEnd - n.domainLookupStart,
  };
};
