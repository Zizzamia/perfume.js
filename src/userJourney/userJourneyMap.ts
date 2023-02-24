export const userJourneyMap = {
  finalMarkToStepsMap: {} as Record<string, Record<string, string[]>>,
  startMarkToStepsMap: {} as Record<string, Record<string, boolean>>,
  finalSteps: {} as Record<string, string[]>,
  activeSteps: {} as Record<string, boolean>,
};

/**
 * this method allows to add new steps by passing the start mark
 *
 */
export const addActiveSteps = (startMark: string) => {
  const newSteps = userJourneyMap.startMarkToStepsMap[startMark] ?? [];
  // adding the new steps to the active map
  Object.keys(newSteps).forEach(step => {
    if (userJourneyMap.activeSteps[step]) {
      return;
    } else {
      userJourneyMap.activeSteps[step] = true;
    }
  });
};

/**
 * removes one step from active steps
 *
 */
export const removeActiveStep = (step: string) => {
  delete userJourneyMap.activeSteps[step];
};

export const resetActiveSteps = () => {
  userJourneyMap.activeSteps = {};
};

export const resetUserJourneyMap = () => {
  // reset all values
  userJourneyMap.startMarkToStepsMap = {};
  userJourneyMap.finalMarkToStepsMap = {};
  userJourneyMap.finalSteps = {};
  resetActiveSteps();
};
