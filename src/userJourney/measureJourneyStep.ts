import { WP } from '../constants';
import { reportPerf } from '../reportPerf';
import { config } from '../config';

import { getJourneyMarkName } from './getJourneyMarkName';
import { getJourneyStepMetricName } from './getJourneyStepMetricName';
import { USER_JOURNEY_THRESHOLDS } from '../vitalsScore';
import { getRating } from './getRating';
import { measureJourney } from './measureJourney';
import { getJourneyStepVitalMetricName } from './getJourneyStepVitalMetricName';

export const measureJourneyStep = (
  step: string,
  startMark: string,
  endMark: string,
) => {
  const journeyStepMetricName = getJourneyStepMetricName(step);
  const startMarkName = getJourneyMarkName(startMark);
  const endMarkName = getJourneyMarkName(endMark);

  const isLaunchJourney = startMark === 'launch';
  const startMarkExists = WP.getEntriesByName(startMarkName).length > 0;
  const endMarkExists = WP.getEntriesByName(endMarkName).length > 0;
  if (!endMarkExists || !config.userJourneySteps) {
    return;
  }

  const { maxOutlierThreshold, vitalsThresholds } =
    USER_JOURNEY_THRESHOLDS[config.userJourneySteps[step].threshold];

  if (isLaunchJourney) {
    const duration = 0;
    const journeyStepMeasure = WP.measure(journeyStepMetricName, {
      duration,
      end: endMarkName,
    });
    const score = getRating(duration, vitalsThresholds);
    // Do not want to measure or log negative metrics
    if (duration >= 0) {
      reportPerf(
        step,
        journeyStepMeasure.duration,
        score,
        { category: 'user_journey_step' },
        undefined,
      );
      measureJourney(step);
    }
  } else if (startMarkExists) {
    const journeyStepMeasure = WP.measure(
      journeyStepMetricName,
      startMarkName,
      endMarkName,
    );
    const { duration } = journeyStepMeasure;
    if (duration <= maxOutlierThreshold) {
      const score = getRating(duration, vitalsThresholds);
      // Do not want to measure or log negative metrics
      if (duration >= 0) {
        reportPerf(
          step,
          duration,
          score,
          { category: 'user_journey_step' },
          undefined,
        );
        const journeyStepVitalMetricName = getJourneyStepVitalMetricName(
          step,
          score,
        );
        WP.measure(journeyStepVitalMetricName, {
          start: journeyStepMeasure.startTime + journeyStepMeasure.duration,
          end: journeyStepMeasure.startTime + journeyStepMeasure.duration,
          detail: {
            type: 'userJourneyStepVital',
            duration,
          },
        });
      }
    }
    measureJourney(step);
  }
};
