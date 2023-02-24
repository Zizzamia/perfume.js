import { IVitalsScore } from "../types";
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
export const getJourneyStepVitalMetricName = (step: string, rating: IVitalsScore) => `user_journey_step.${step}_vitals_${rating}`;