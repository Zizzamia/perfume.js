import { config } from "../config";
import { reportPerf } from "../reportPerf";

import { WP } from "../constants";
import { userJourneyMap } from "./userJourneyMap";
import { getJourneyStepMetricName } from "./getJourneyStepMetricName";
import { getJourneyMetricName } from "./getJourneyMetricName";

export const measureJourney = (step: string) => {
    if (userJourneyMap.finalSteps[step]) {
        const journeys = userJourneyMap.finalSteps[step];
        journeys?.forEach((journey) => {
          if (journey === 'steps') {
            return;
          }
          if (!config.userJourneys) {
            return;
          }
          const { steps, maxOutlierThreshold } = config.userJourneys[journey];
          let journeyDuration = 0;
          let everyStepIsMeasured = true;
          let finalStepEndTime;
          steps.forEach((journeyStep, index) => {
            if (!everyStepIsMeasured) {
              return;
            }
            const journeyStepMetricName = getJourneyStepMetricName(journeyStep);
            const journeyStepEntries =
              WP.getEntriesByName(journeyStepMetricName);
            if (journeyStepEntries.length === 0) {
              everyStepIsMeasured = false;
            } else {
              const lastEntry = journeyStepEntries[journeyStepEntries.length - 1];
              journeyDuration += lastEntry.duration;
              if (index === steps.length - 1) {
                finalStepEndTime = lastEntry.startTime + lastEntry.duration;
              }
            }
          });
          const threshold = (maxOutlierThreshold ?? config.journeyMaxOutlierThreshold) ?? 100000;
          if (everyStepIsMeasured && journeyDuration <= threshold) {
            const journeyMetricName = getJourneyMetricName(journey);
            // Do not want to measure or log negative metrics
            if (journeyDuration >= 0) {
              reportPerf(journey, journeyDuration, null, {category: 'user_journey'}, undefined);
              WP.measure(journeyMetricName, {
                start: finalStepEndTime ? finalStepEndTime - journeyDuration : finalStepEndTime,
                end: finalStepEndTime,
                detail: {
                  type: 'userJourney',
                  duration: journeyDuration,
                },
              });
            }
          }
        });
      }
} 