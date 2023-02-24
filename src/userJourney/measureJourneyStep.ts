import { M, WP } from '../constants';
import { reportPerf } from '../reportPerf';
import { config } from '../config';

import { getJourneyStepMetricName } from './getJourneyStepMetricName';
import { USER_JOURNEY_THRESHOLDS } from '../vitalsScore';
import { getRating } from '../vitalsScore';
import { getJourneyStepVitalMetricName } from './getJourneyStepVitalMetricName';

export const measureJourneyStep = (
  step: string,
  startMark: string,
  endMark: string,
) => {
  const journeyStepMetricName = getJourneyStepMetricName(step);

  const isLaunchJourney = startMark === 'launch';
  const startMarkExists = WP.getEntriesByName(M + startMark).length > 0;
  const endMarkExists = WP.getEntriesByName(M + endMark).length > 0;
  if (!endMarkExists || !config.userJourneySteps) {
    return;
  }

  const { maxOutlierThreshold, vitalsThresholds } =
    USER_JOURNEY_THRESHOLDS[config.userJourneySteps[step].threshold];

  if (isLaunchJourney) {
    const duration = 0;
    const journeyStepMeasure = WP.measure(journeyStepMetricName, {
      duration,
      end: M + endMark,
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
    }
  } else if (startMarkExists) {
    const journeyStepMeasure = WP.measure(
      journeyStepMetricName,
      M + startMark,
      M + endMark,
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
  }
};
