import { IStepConfig, IUserJourney, } from './types';

import { config } from './config';


export const userJourneyMap = {
    finalMarkToStepsMap: {} as Record<string, Record<string, string[]>>,
    startMarkToStepsMap: {} as Record<string, Record<string, boolean>>,
    finalSteps: {} as Record<string, string[]>,
    activeSteps: {} as Record<string, boolean>,
  };

  export const resetActiveSteps = ()  => {
    userJourneyMap.activeSteps = {};
  }

  export const resetUserJourneyMap = ()  => {
    // reset all values
    userJourneyMap.startMarkToStepsMap = {};
    userJourneyMap.finalMarkToStepsMap = {};
    userJourneyMap.finalSteps = {}; 
    resetActiveSteps();
  }

  export const setUserJourneyStepsMap = () => {
    if (!config.userJourneySteps) {
      return;
    }

    resetUserJourneyMap();

    Object.entries<IStepConfig<string>>(config.userJourneySteps).forEach(([step, { marks }]) => {
      const startMark = marks[0];
      const endMark = marks[1];
      console.log(`the start mark is: ${  startMark}`)
        // getting the current steps associated with the current start mark
        const currentStartMarks = userJourneyMap.startMarkToStepsMap[startMark] ?? {}
        currentStartMarks[step] = true;
        userJourneyMap.startMarkToStepsMap[startMark] = currentStartMarks;

      if (!userJourneyMap.finalMarkToStepsMap[endMark]) {
        // insert when top level end mark is not present
        userJourneyMap.finalMarkToStepsMap[endMark] = {[startMark]: [step]};
      } else {
        // insert when end mark and start mark are both present
        const currentSteps = userJourneyMap.finalMarkToStepsMap[endMark][startMark];
        currentSteps.push(step);
        userJourneyMap.finalMarkToStepsMap[endMark][startMark] = currentSteps;
    }
    });
    console.log(JSON.stringify(userJourneyMap))
  }

  export const setUserJourneyFinalStepsMap = ()  => {
    if (!config.userJourneys) {
      return;
    }
    // reset values
    userJourneyMap.finalSteps = {};

    Object.entries<IUserJourney<string> | IStepConfig<string>>(config.userJourneys).forEach(
      ([key, value]) => {
        if (key !== 'steps') {
          const { steps } = value as IUserJourney<string>;
          const finalStep = steps[steps.length - 1];
          if (userJourneyMap.finalSteps[finalStep]){
            userJourneyMap.finalSteps[finalStep].push(key)
          } else {
            userJourneyMap.finalSteps[finalStep] = [key];
          }
        }
      },
    );
    console.log(JSON.stringify(userJourneyMap))

  }

  /**
   * this method allows to add new steps by passing the start mark
   *
   * @param startMark
   */
  export const addActiveSteps = (startMark: string) => {
    const newSteps = userJourneyMap.startMarkToStepsMap[startMark] ?? [];
    // adding the new steps to the active map
    Object.keys(newSteps).forEach(step => {
        if(userJourneyMap.activeSteps[step]){
            return;
        } else { 
            userJourneyMap.activeSteps[step] = true; 
        }
    })
  }

  /**
   * removes one step from active steps
   * 
   * @param step
   */
  export const removeActiveStep = (step: string) => {
    delete userJourneyMap.activeSteps[step];
  }
