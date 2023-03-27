import { ntbt } from './metrics';
import { logMetric } from './log';
import { getVitalsScore } from './vitalsScore';

import { end, start } from './steps/markStep';

let ntbtTimeoutID = 0;

/**
 * NTBT = Navigation Total Blocking Time
 *
 * This metric measures the amount of time the application may be blocked
 * from processing code during the 2s window after a user navigates
 * from page A to page B.
 *
 * Because this library is navigation agnostic, we have this method
 * to mark when the navigation starts.
 *
 * The NTBT metric is the summation of the blocking time of all long tasks
 * in the 2s window after this method is invoked.
 *
 * If this method is called before the 2s window ends; it will trigger a new
 * NTBT measurement and interrupt the previous one.
 *
 * Credit: Thank you Steven Lam for helping with this!
 */
 export const markNTBT = (): void => {
  start('ntbt');
  // Reset NTBT value
  ntbt.value = 0;
  clearTimeout(ntbtTimeoutID);
  // @ts-ignore
  ntbtTimeoutID = setTimeout(() => {
    end('ntbt', {}, false);
    logMetric({
      attribution: {},
      name: `NTBT`,
      rating: getVitalsScore('NTBT', ntbt.value),
      value: ntbt.value,
    });
    ntbt.value = 0;
  }, 2000);
};
