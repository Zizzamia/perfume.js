export const steps = {
  finalMarkToStepsMap: {} as Record<string, Record<string, string[]>>,
  startMarkToStepsMap: {} as Record<string, Record<string, boolean>>,
  active: {} as Record<string, boolean>,
  /**
    An internal data structure to represent the state of active steps.
    In this data structure, the keys represent the navgiation index, starting at 0 - 
    i.e - the initial app launch it's index 0, the first navigation is index 1 and so one.
    The value of each navigation index is a Set of all the first marks for the currently active steps. 
    When a start mark is hit - it will be added to this state. 
    When a corresponding end mark is hit, the start mark previously added will be removed from this navigation state
    Examples:
    Example of the state when home is loading:
    {
      [0]: ['start_navigate_to_home_screen'] // load home - empty array since home has loaded
    }
    Example of the state during the navigation from home to assets
    {
      [0]: [] // load home - empty array since home has loaded
      [1]: ['start_navigate_to_trade_screen']
    }
   */
  navigationSteps: {} as Record<number, Record<string, boolean>>,
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

export const resetNavigationSteps = () => {
  steps.navigationSteps = {};
}

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
  resetNavigationSteps();
};

export const getNavigationState = () => steps.navigationSteps 

export const getStepsFromNavigation = (navIndex: number) =>  {
  const navigationSteps = getNavigationState();
  return navigationSteps[navIndex] ?? {};
}
