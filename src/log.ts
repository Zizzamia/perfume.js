import { config } from './config';
import { C } from './constants';

/**
 * Ensures console.warn exist and logging is enable for
 * warning messages
 */
export const logWarn = (message: string): void => {
  if (!config.logging) {
    return;
  }
  C.warn(config.logPrefix, message);
}
