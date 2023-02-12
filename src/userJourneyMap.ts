/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { IStepConfig, IUserJourney, IVitalsScore, IMetricMap } from './types';

import { config } from './config';


export const userJourneyMap = {
    finalMarkToStepsMap: new Map<string, Map<string, string[]>>(),
    startMarkToStepsMap: {} as Record<string, Set<string>>,
    finalSteps: new Map<string, string[]>(),
    activeSteps: {} as IMetricMap,
  };

  export function resetActiveSteps() {
    userJourneyMap.activeSteps = {};
  }

  export function resetUserJourneyMap() {
    // reset all values
    userJourneyMap.startMarkToStepsMap = {};
    userJourneyMap.finalMarkToStepsMap = new Map<string, Map<string, string[]>>();
    userJourneyMap.finalSteps = new Map<string, string[]>();
    resetActiveSteps();
  }

  export function setUserJourneyStepsMap() {
    if (!config.userJourneySteps) {
      return;
    }

    resetUserJourneyMap();

    Object.entries<IStepConfig<string>>(config.userJourneySteps).forEach(([step, { marks }]) => {
      const startMark = marks[0];
      const endMark = marks[1];

      // TODO -  currently broken, sets all values as an empty {}, ex "launch": {}
      userJourneyMap.startMarkToStepsMap[startMark] = new Set<string>([
        ...(userJourneyMap.startMarkToStepsMap[startMark] ?? []),
        step,
      ]);

      if (!userJourneyMap.finalMarkToStepsMap.has(endMark)) {
        // insert when top level end mark is not present
        // TODO - currently broken, doesnt set any value
        userJourneyMap.finalMarkToStepsMap.set(endMark, new Map([[startMark, [step]]]));
      } else if (!userJourneyMap.finalMarkToStepsMap.get(endMark)?.has(startMark)) {
        // insert when top level end mark is present but second level start mark is not
        // TODO - currently broken, doesnt set any value
        userJourneyMap.finalMarkToStepsMap.get(endMark)?.set(startMark, [step]);
      } else {
        // insert when end mark and start mark are both presen
        // TODO - currently broken, doesnt set any value
        userJourneyMap.finalMarkToStepsMap.get(endMark)?.get(startMark)?.push(step);
      }
    });
  }

  export function setUserJourneyFinalStepsMap() {
    if (!config.userJourneys) {
      return;
    }
    // reset values
    userJourneyMap.finalSteps = new Map<string, string[]>();

    Object.entries<IUserJourney<string> | IStepConfig<string>>(config.userJourneys).forEach(
      ([key, value]) => {
        if (key !== 'steps') {
          const { steps } = value as IUserJourney<string>;
          const finalStep = steps[steps.length - 1];
          if (userJourneyMap.finalSteps.has(finalStep)) {
            // TODO - currently broken, doesnt update map
            userJourneyMap.finalSteps.get(finalStep)?.push(key);
          } else {
            // TODO - currently broken, doesnt update map
            userJourneyMap.finalSteps.set(finalStep, [key]);
          }
        }
      },
    );
  }

  /**
   * this method allows to add new steps by passing the start mark
   * @param startMark
   */
  export function addActiveSteps(startMark: string) {
    const newSteps = userJourneyMap.startMarkToStepsMap[startMark] ?? [];
    // adding the new steps to the active map
    newSteps.forEach(step => { 
        // if we already have it as an active step, do nothing , else add it as active. 
        if(userJourneyMap.activeSteps[step]){
            return;
        } else { 
            userJourneyMap.activeSteps[step] = true; 
        }
    })
  }

  /**
   * removes one step from active steps
   * @param step
   */
  export function removeActiveStep(step: string) {
    delete userJourneyMap.activeSteps[step];
  }
