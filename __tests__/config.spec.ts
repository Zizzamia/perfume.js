import { config } from '../src/config';

describe('config', () => {
  it('should be defined', () => {
    expect(config.logPrefix).toEqual('Perfume.js:');
    expect(config.logging).toEqual(true);
    expect(config.maxMeasureTime).toEqual(15000);
  });
});