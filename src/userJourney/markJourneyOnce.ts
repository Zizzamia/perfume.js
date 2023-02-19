import { WP } from '../constants';

import { getJourneyMarkName } from './getJourneyMarkName';
import { measureJourneySteps } from './measureJourneySteps';

/**
 * Function which creates a journey mark with a name generated
 * from the provided mark if a mark with the same name does not
 * already exist when called.
 *
 * The generated mark name has the following format:
 * `user_journey_mark.${mark}`
 *
 */
export const markJourneyOnce = (mark: string) => {
  const markName = getJourneyMarkName(mark);
  if (WP.getEntriesByName(markName).length === 0) {
    WP.mark(markName);
    measureJourneySteps(mark);
  }
};
