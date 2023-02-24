import { config } from '../config';

import {
  userJourneyMap,
  addActiveSteps,
  removeActiveStep,
} from './userJourneyMap';

import { measureJourneyStep } from './measureJourneyStep';

export const measureJourneySteps = (endMark: string) => {
  if (userJourneyMap.finalMarkToStepsMap[endMark]) {
    // this is an end mark so we delete the entry
    const finalSteps = userJourneyMap.finalMarkToStepsMap[endMark];
    Object.keys(finalSteps).forEach(startMark => {
      const steps = finalSteps[startMark];
      steps.forEach(removeActiveStep);
      Promise.all(
        steps.map(async step => {
          // measure
          await measureJourneyStep(step, startMark, endMark);
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
