export const steps = {
  finalMarkToStepsMap: {} as Record<string, Record<string, string[]>>,
  startMarkToStepsMap: {} as Record<string, Record<string, boolean>>,
  active: {} as Record<string, boolean>,
};

/**
 * This method allows to add new steps by passing the start mark
 */
export const addActiveSteps = (startMark: string) => {
  const newSteps = steps.startMarkToStepsMap[startMark] ?? [];
  // adding the new steps to the active map
  Object.keys(newSteps).forEach(step => {
    if (steps.active[step]) {
      return;
    } else {
      steps.active[step] = true;
    }
  });
};

/**
 * Removes one step from active steps
 */
export const removeActiveStep = (step: string) => {
  delete steps.active[step];
};

export const resetActiveSteps = () => {
  steps.active = {};
};

export const resetSteps = () => {
  // reset all values
  steps.startMarkToStepsMap = {};
  steps.finalMarkToStepsMap = {};
  resetActiveSteps();
};
