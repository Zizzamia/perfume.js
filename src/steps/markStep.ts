import { M, WP } from '../constants';
import { isPerformanceSupported } from '../isSupported';
import { logData } from '../log';
import { performanceMeasure } from '../measure';
import { metrics } from '../metrics';
import { roundByFour } from '../utils';

import { measureSteps } from './measureSteps';

/**
 * Function which creates a step mark with a name generated
 * from the provided mark when called.
 *
 * The generated mark name has the following format:
 * `mark.${mark}`
 *
 */
export const markStep = (mark: string) => {
  if (!isPerformanceSupported()) {
    return;
  }
  WP.mark(M + mark);
  measureSteps(mark);
};

// --------------------- TMP Location Before Deprecation -----------------
// For start(), end(), endPaint(), clear()

/**
 * Start performance measurement
 */
export const start = (markName: string): void => {
  if (!isPerformanceSupported() || metrics[markName]) {
    return;
  }
  metrics[markName] = true;
  // Creates a timestamp in the browser's performance entry buffer
  WP.mark(`mark_${markName}_start`);
}

/**
 * End performance measurement
 */
 export const end = (markName: string, customProperties = {}, doLogData = true): void => {
  if (!isPerformanceSupported() || !metrics[markName]) {
    return;
  }
  // End Performance Mark
  WP.mark(`mark_${markName}_end`);
  delete metrics[markName];
  const measure = performanceMeasure(markName);
  if (doLogData) {
    logData(markName, roundByFour(measure), customProperties);
  }
}

/**
 * End performance measurement after first paint from the beging of it
 */
 export const endPaint = (markName: string, customProperties?: object): void => {
  setTimeout(() => {
    end(markName, customProperties);
  });
}

/**
 * Removes the named mark from the browser's performance entry buffer.
 */
 export const clear = (markName: string): void => {
  delete metrics[markName];
  // Mobile Safari v13 and UC Browser v11
  // don't support clearMarks yet
  if (!WP.clearMarks) {
    return;
  }
  WP.clearMarks(`mark_${markName}_start`);
  WP.clearMarks(`mark_${markName}_end`);
}
