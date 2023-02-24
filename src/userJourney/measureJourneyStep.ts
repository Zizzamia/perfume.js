import { M, S, WP } from '../constants';
import { reportPerf } from '../reportPerf';
import { config } from '../config';

import { STEP_THRESHOLDS } from '../vitalsScore';
import { getRating } from '../vitalsScore';

export const measureJourneyStep = (
  step: string,
  startMark: string,
  endMark: string,
) => {
  const journeyStepMetricName = S + step;
  const startMarkExists = WP.getEntriesByName(M + startMark).length > 0;
  const endMarkExists = WP.getEntriesByName(M + endMark).length > 0;
  if (!endMarkExists || !config.userJourneySteps) {
    return;
  }

  const { maxOutlierThreshold, vitalsThresholds } =
    STEP_THRESHOLDS[config.userJourneySteps[step].threshold];

  if (startMarkExists) {
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
        reportPerf(step, duration, score, { category: 'step' }, undefined);
        WP.measure(`user_journey_step.${step}_vitals_${score}`, {
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
