import { config } from '../config';
import { IStepConfig, IUserJourney } from '../types';

import { resetUserJourneyMap, userJourneyMap } from './userJourneyMap';

export const setStepsMap = () => {
  if (!config.userJourneySteps) {
    return;
  }

  resetUserJourneyMap();

  Object.entries<IStepConfig<string>>(config.userJourneySteps).forEach(
    ([step, { marks }]) => {
      const startMark = marks[0];
      const endMark = marks[1];
      // getting the current steps associated with the current start mark
      const currentStartMarks =
        userJourneyMap.startMarkToStepsMap[startMark] ?? {};
      currentStartMarks[step] = true;
      userJourneyMap.startMarkToStepsMap[startMark] = currentStartMarks;

      if (!userJourneyMap.finalMarkToStepsMap[endMark]) {
        // insert when top level end mark is not present
        userJourneyMap.finalMarkToStepsMap[endMark] = { [startMark]: [step] };
      } else {
        // insert when end mark and start mark are both present
        const currentSteps =
          userJourneyMap.finalMarkToStepsMap[endMark][startMark];
        currentSteps.push(step);
        userJourneyMap.finalMarkToStepsMap[endMark][startMark] = currentSteps;
      }
    },
  );
};
