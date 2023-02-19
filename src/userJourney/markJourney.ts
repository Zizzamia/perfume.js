import { WP } from '../constants';

import { getJourneyMarkName } from './getJourneyMarkName';
import { measureJourneySteps } from './measureJourneySteps';

/**
 * Function which creates a journey mark with a name generated
 * from the provided mark when called.
 *
 * The generated mark name has the following format:
 * `user_journey_mark.${mark}`
 *
 */
export const markJourney = (mark: string) => {
  const markName = getJourneyMarkName(mark);
  WP.mark(markName);
  measureJourneySteps(mark);
};
