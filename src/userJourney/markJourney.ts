import { M, WP } from '../constants';

import { measureSteps } from './measureSteps';

/**
 * Function which creates a journey mark with a name generated
 * from the provided mark when called.
 *
 * The generated mark name has the following format:
 * `mark.${mark}`
 *
 */
export const markJourney = (mark: string) => {
  WP.mark(M + mark);
  measureSteps(mark);
};
