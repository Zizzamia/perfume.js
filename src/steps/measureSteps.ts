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
      /** 
       * Async processing all possible steps - needs to be async due to clearing previously measured steps and marks. 
       * If we run all concurrently, there is a chance for a race condition where we are adding and deleteing the entries in WP.Performance which caused the measure to fail.
       */
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
  const navigationBasedActiveSteps = getActiveStepsFromNavigationSteps();
  config.onMarkStep?.(mark, Object.keys(navigationBasedActiveSteps));
};
