import { WN } from './constants';
import { INavigatorInfo } from './types';

/**
 * Information coming from window.navigator:
 * 1. Device Memory
 * 2. Hardware Concurency
 * 3. Status of the service worker:
 *     - controlled: a service worker is controlling the page
 *     - supported: the browser supports service worker
 *     - unsupported: the user's browser does not support service worker
 */
export const getNavigatorInfo = function(): INavigatorInfo {
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
};
