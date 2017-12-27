import Perfume from '../src/perfume';

/**
 * Perfume test
 */
describe('Perfume test', () => {
  let perfume;

  beforeAll(function () {
    window.performance = {
      now: (function() {
        return Date.now;
      })();
    };
  });

  beforeEach(() => {
    perfume = new Perfume();
  });

  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('Perfume is instantiable', () => {
    expect(perfume).toBeInstanceOf(Perfume);
  });

  it('has "supportsPerfNow" method after initialization', () => {
    expect(perfume.supportsPerfNow).toBeDefined();
  });

  it('has "supportsPerfMark" method after initialization', () => {
    expect(perfume.supportsPerfMark).toBeDefined();
  });

  it('has "getMeasurementForGivenName" method after initialization', () => {
    expect(perfume.getMeasurementForGivenName).toBeDefined();
  });

  it('has "checkMetricName" method after initialization', () => {
    expect(perfume.checkMetricName).toBeDefined();
  });

  it('has "start" method after initialization', () => {
    expect(perfume.start).toBeDefined();
  });

  it('has "end" method after initialization', () => {
    expect(perfume.end).toBeDefined();
  });

  it('has "getFirstPaint" method after initialization', () => {
    expect(perfume.getFirstPaint).toBeDefined();
  });

  it('has "firstPaint" method after initialization', () => {
    expect(perfume.firstPaint).toBeDefined();
  });

  it('has "log" method after initialization', () => {
    expect(perfume.log).toBeDefined();
  });
});
