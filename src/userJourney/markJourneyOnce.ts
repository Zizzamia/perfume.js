import { M, WP } from '../constants';

import { measureSteps } from './measureSteps';

/**
 * Function which creates a journey mark with a name generated
 * from the provided mark if a mark with the same name does not
 * already exist when called.
 *
 * The generated mark name has the following format:
 * `mark.${mark}`
 *
 */
export const markJourneyOnce = (mark: string) => {
  if (WP.getEntriesByName(M + mark).length === 0) {
    WP.mark(M + mark);
    measureSteps(mark);
  }
};
