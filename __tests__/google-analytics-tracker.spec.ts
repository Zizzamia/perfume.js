import GoogleAnalyticsTracker from '../src/google-analytics-tracker';
import Metric from '../src/metric';

describe('GoogleAnalyticsTracker', () => {
  let googleAnalyticsTracker: GoogleAnalyticsTracker;

  beforeEach(() => {
    googleAnalyticsTracker = new GoogleAnalyticsTracker();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('canSend', () => {
    it('should return true', () => {
      (window as any).ga = () => {};
      expect(googleAnalyticsTracker.canSend()).toBeTruthy();
    });

    it('should return false', () => {
      (window as any).ga = null;
      expect(googleAnalyticsTracker.canSend()).toBeFalsy();

      (window as any).ga = undefined;
      expect(googleAnalyticsTracker.canSend()).toBeFalsy();
    });
  });

  describe('send', () => {
    it('should send', () => {
      const gaMock = jest.fn(() => {});
      (window as any).ga = gaMock;

      const metricName = 'metricName';
      const duration = 123;
      googleAnalyticsTracker.send(new Metric(metricName, duration));

      expect(gaMock).toHaveBeenCalledTimes(1);
      expect(gaMock).toHaveBeenCalledWith(
        'send',
        'timing',
        metricName,
        googleAnalyticsTracker.timingVar,
        Math.round(duration),
      );
    });
  });
});
