import Perfume from '../../src/perfume'
import { config } from '../../src/config';

import { testConfig } from '../../src/userJourneyTestConstants'

describe('initPerformanceVitals', () => {
  it('correctly sets configuration', () => {
    expect(config).not.toMatchObject(testConfig);
    const perfume = new Perfume(testConfig);
    expect(config).toMatchObject(testConfig);
  });
});