import { config } from '../config';

import { measureStep } from './measureStep';
import { steps, addActiveSteps, removeActiveStep } from './steps';
import {
  getActiveStepsFromNavigationSteps,
  recordEndMark,
  recordStartMark,
} from './navigationSteps';

export const measureSteps = (mark: string) => {
  if (steps.finalMarkToStepsMap[mark]) {
    recordEndMark(mark);
    // this is an end mark so we delete the entry
    const finalSteps = steps.finalMarkToStepsMap[mark];
    Object.keys(finalSteps).forEach(startMark => {
      const possibleSteps = finalSteps[startMark];
      possibleSteps.forEach(removeActiveStep);
      Promise.all(
        possibleSteps.map(async step => {
          // measure
          await measureStep(step, startMark, mark);
        }),
      ).catch(() => {
        // TODO @zizzamia log error
      });
    });
  } else {
    recordStartMark(mark);
    addActiveSteps(mark);
  }
  if (config.enableNavigationBasedActiveSteps) {
    const navigationBasedActiveSteps = getActiveStepsFromNavigationSteps();
    config.onMarkStep?.(mark, Object.keys(navigationBasedActiveSteps));
  } else {
    config.onMarkStep?.(mark, Object.keys(steps.active));
  }
};
