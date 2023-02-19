import { config } from '../config';

import { userJourneyMap, addActiveSteps } from './userJourneyMap';

export const measureJourneySteps = (endMark: string) => {
  if (userJourneyMap.finalMarkToStepsMap[endMark]) {
    // this is an end mark so we delete the entry
    // Implementation coming in P3 PR
  } else {
    addActiveSteps(endMark);
  }
  config.onMarkJourney?.(endMark, Object.keys(userJourneyMap.activeSteps));
};