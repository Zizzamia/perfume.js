import { config } from '../config';

import { measureStep } from './measureStep';
import { steps, addActiveSteps, removeActiveStep } from './steps';

export const measureSteps = (endMark: string) => {
  if (steps.finalMarkToStepsMap[endMark]) {
    // this is an end mark so we delete the entry
    const finalSteps = steps.finalMarkToStepsMap[endMark];
    Object.keys(finalSteps).forEach(startMark => {
      const possibleSteps = finalSteps[startMark];
      possibleSteps.forEach(removeActiveStep);
      Promise.all(
        possibleSteps.map(async step => {
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
  config.onMarkStep?.(endMark, Object.keys(steps.active));
};
