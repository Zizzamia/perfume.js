import { config } from '../src/config';

describe('config', () => {
  it('should be defined', () => {
    expect(config.maxTime).toEqual(30000);
  });
});