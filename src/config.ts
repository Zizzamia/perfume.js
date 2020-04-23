import { IPerfumeConfig } from './types';

export const config: IPerfumeConfig = {
  // Metrics
  resourceTiming: false,
  // Logging
  logPrefix: 'Perfume.js:',
  logging: true,
  maxMeasureTime: 15000,
};
