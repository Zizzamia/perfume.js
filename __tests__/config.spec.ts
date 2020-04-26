import { config } from '../src/config';

describe('config', () => {
  it('should be defined', () => {
    expect(config.loggingPrefix).toEqual('Perfume.js:');
    expect(config.isLogging).toEqual(true);
    expect(config.maxTime).toEqual(15000);
  });
});