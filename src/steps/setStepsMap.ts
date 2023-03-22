import { config } from '../config';
import { IStepConfig } from '../types';

import { resetSteps, steps } from './steps';

export const setStepsMap = () => {
  if (!config.steps) {
    return;
  }
  resetSteps();

  Object.entries<IStepConfig<string>>(config.steps).forEach(
    ([step, { marks }]) => {
      const startMark = marks[0];
      const endMark = marks[1];
      // getting the current steps associated with the current start mark
      const currentStartMarks = steps.startMarkToStepsMap[startMark] ?? {};
      currentStartMarks[step] = true;
      steps.startMarkToStepsMap[startMark] = currentStartMarks;

      if (!steps.finalMarkToStepsMap[endMark]) {
        // insert when top level end mark is not present
        steps.finalMarkToStepsMap[endMark] = { [startMark]: [step] };
      } else {
        // insert when end mark and start mark are both present
        const currentSteps = steps.finalMarkToStepsMap[endMark][startMark] || [];
        currentSteps.push(step);
        steps.finalMarkToStepsMap[endMark][startMark] = currentSteps;
      }
    },
  );
};
