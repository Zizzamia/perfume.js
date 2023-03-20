import { config } from './../config';
import {getNavigationState, getStepsFromNavigation, steps } from './steps';


// We only report the active steps in the last 2 navigation step to prevent
// Convert the steps.navigationSteps to an array of active steps.
// "stale steps" from being reported.
//
// "stale steps" are defined as steps where the start mark was executed but the
// corresponding end mark was never executed - thus leaving it as a "stale step"
export const getActiveStepsFromNavigationSteps = (): Record<string, boolean>  => {
  const navigationSteps = getNavigationState();
  const { startMarkToStepsMap } = steps;
  if (Object.keys(navigationSteps).length === 0) {
    return {};
  }

  const activeSteps: Record<string, boolean> = {};
  const currentNavIndex = Object.keys(navigationSteps).length - 1;

  const currentNavStep = getStepsFromNavigation(currentNavIndex);

  Object.keys(currentNavStep).forEach((startMark: string) => {
    const ongoingSteps = startMarkToStepsMap[startMark] ?? [];
    Object.keys(ongoingSteps).forEach((step) => {
      activeSteps[step] = true;
    });
  });

  // if nav length is >1, then check the nav step prior as well
  if (Object.keys(navigationSteps).length > 1) {
    const prevNavStep = getStepsFromNavigation(currentNavIndex - 1);

    Object.keys(prevNavStep).forEach((startMark: string) => {
      const prevNavSteps = startMarkToStepsMap[startMark] ?? [];
      Object.keys(prevNavSteps).forEach((step) => {
        activeSteps[step] = true;
      });
    });
  }

  return activeSteps;
}

// start mark for navigationSteps data structure
export const recordStartMark = (startMark: string) => {
  const { navigationSteps } = steps;

  // if we don't have any initial states recorded, initialize one
  const navigationLength = Object.keys(navigationSteps).length > 0 ? Object.keys(navigationSteps).length : 1;
  const lastNavIndex = navigationLength - 1;
  const currentMarks = getStepsFromNavigation(lastNavIndex) || [];

  const newCurrentMark = currentMarks;
  newCurrentMark[startMark] = true;
  navigationSteps[lastNavIndex] = newCurrentMark;
}

export const recordEndMark = (endMark: string) => {
  const { navigationSteps, finalMarkToStepsMap } = steps;

  const navigationLength = Object.keys(navigationSteps).length;
  if (navigationLength === 0) {
    return;
  }

  const currentNavIndex = navigationLength - 1;
  const ongoingNavStep = getStepsFromNavigation(currentNavIndex);

  if (!ongoingNavStep || !finalMarkToStepsMap[endMark]) {
    return;
  }

  const endMarkMap = finalMarkToStepsMap[endMark];
  if (!endMarkMap) {
    return;
  }

  // loop through all steps where end mark is present and check if their start mark is present
  // in the navigation state. If so, remove it to signal that the step has been completed
  
  Object.keys(endMarkMap).forEach((startMark) => {
    if (ongoingNavStep[startMark]) {
      const currentNavStep = getStepsFromNavigation(currentNavIndex) || {};

      // Only remove the startMark, not other ongoing steps
      currentNavStep[startMark] = false;
      // if start mark is in navigation state, remove it to signal that the step has completed
      navigationSteps[currentNavIndex] =  currentNavStep;
    }

    // if nav length is >1, then check the nav step prior as well
    if (navigationLength > 1) {
      const lastNavIndex = currentNavIndex - 1;
      const lastNavStep = getStepsFromNavigation(lastNavIndex);
      if (lastNavStep[startMark]) {
        lastNavStep[startMark] = false;
        navigationSteps[lastNavIndex] = lastNavStep;
      }
    }
  });
}

// An API consumers must use to update internal state based on page/screen navigations.
// Internal state must be updated when the following are true
// 1. Journey marks are hit
// 2. Page navigations occur
// This function ensures the 2nd case is covered to help prevent "stale"
// steps that don't hit their final mark because the users navigates
// backwards in journey.
export const incrementCujNavigation = () => {
  // navigationSteps are 0-index based, so size will give us the next key value
  const navigationLength = Object.keys(steps.navigationSteps).length;
  steps.navigationSteps[navigationLength] = {};

  // when navigating, we should notify the user in case stale steps are
  // removed from the state during navigations
  const activeSteps = getActiveStepsFromNavigationSteps();
  config.onMarkStep?.('',  Object.keys(activeSteps));

}