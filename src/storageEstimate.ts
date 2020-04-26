import { WN } from './constants';
import { logData } from './log';
import { convertToKB } from './utils';

/**
 * The estimate() method of the StorageManager interface asks the Storage Manager
 * for how much storage the app takes up (usage),
 * and how much space is available (quota).
 */
export const initStorageEstimate = () => {
  if (WN && WN.storage) {
    WN.storage.estimate().then(reportStorageEstimate);
  }
};

export const reportStorageEstimate = (storageInfo: StorageEstimate) => {
  let estimateUsageDetails: any = {};
  if ('usageDetails' in storageInfo) {
    estimateUsageDetails = (storageInfo as any).usageDetails;
  }
  logData('storageEstimate', {
    quota: convertToKB((storageInfo as any).quota),
    usage: convertToKB((storageInfo as any).usage),
    caches: convertToKB(estimateUsageDetails.caches),
    indexedDB: convertToKB(estimateUsageDetails.indexedDB),
    serviceWorker: convertToKB(
      estimateUsageDetails.serviceWorkerRegistrations,
    ),
  });
};
