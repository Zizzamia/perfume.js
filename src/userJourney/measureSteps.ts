import { config } from '../config';

import { measureStep } from './measureStep';
import {
  userJourneyMap,
  addActiveSteps,
  removeActiveStep,
} from './userJourneyMap';

export const measureSteps = (endMark: string) => {
  if (userJourneyMap.finalMarkToStepsMap[endMark]) {
    // this is an end mark so we delete the entry
    const finalSteps = userJourneyMap.finalMarkToStepsMap[endMark];
    Object.keys(finalSteps).forEach(startMark => {
      const steps = finalSteps[startMark];
      steps.forEach(removeActiveStep);
      Promise.all(
        steps.map(async step => {
          // measure
          await measureStep(step, startMark, endMark);
        }),
      ).catch(() => {
        // TODO @zizzamia log error
      });
    });
  } else {
    addActiveSteps(endMark);
  }
  config.onMarkJourney?.(endMark, Object.keys(userJourneyMap.activeSteps));
};
