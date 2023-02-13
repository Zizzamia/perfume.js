import { config } from './config';

import { getJourneyMarkName } from './utils';
import {  WP } from './constants';

import { userJourneyMap, addActiveSteps } from './userJourneyMap';

const measureJourneySteps = (endMark: string) => {
    if (userJourneyMap.finalMarkToStepsMap[endMark]) {
      // this is an end mark so we delete the entry
      // Implementation coming in P3 PR
    } else {
      addActiveSteps(endMark);
    }
    config.onMarkJourney?.(endMark, Object.keys(userJourneyMap.activeSteps));
  
  }
  
  /**
   * Function which creates a journey mark with a name generated
   * from the provided mark when called.
   *
   * The generated mark name has the following format:
   * `user_journey_mark.${mark}`
   *
   * @param mark string that represents the mark
   */
  export const markJourney = (mark: string) => {
    const markName = getJourneyMarkName(mark);
    WP.mark(markName);
    measureJourneySteps(mark);
  }
  
  /**
   * Function which creates a journey mark with a name generated
   * from the provided mark if a mark with the same name does not
   * already exist when called.
   *
   * The generated mark name has the following format:
   * `user_journey_mark.${mark}`
   *
   * @param mark string that represents the mark
   */
  export const markJourneyOnce = (mark: string) => {
    const markName = getJourneyMarkName(mark);
    if (WP.getEntriesByName(markName).length === 0) {
      WP.mark(markName);
      measureJourneySteps(mark);
    }
  }