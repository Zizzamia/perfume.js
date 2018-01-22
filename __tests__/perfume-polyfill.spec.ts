import Perfume from "../src/perfume";

/**
 * Perfume polyfill test
 */
describe("Perfume polyfill test", () => {
  let perfume;

  beforeEach(() => {
    delete window.PerformanceLongTaskTiming;
    delete window.PerformanceObserver;
    perfume = new Perfume();
  });

  beforeEach(() => {
    spyOn(console, "log").and.callThrough();
    spyOn(console, "warn").and.callThrough();
    spyOn(perfume, "firstContentfulPaint").and.callThrough();
    spyOn(perfume, "initPerformanceObserver");
    spyOn(perfume, "timeFirstPaint");
  });

  it("has 'firstContentfulPaint' method after initialization", () => {
    expect(perfume.firstContentfulPaint).toBeDefined();
  });

  describe("when not calls firstContentfulPaint()", () => {
    it("should call initPerformanceObserver()", () => {
      perfume.firstContentfulPaint();
      expect(perfume.initPerformanceObserver).not.toHaveBeenCalled();
    });

    it("should call timeFirstPaint()", () => {
      perfume.firstContentfulPaint();
      expect(perfume.timeFirstPaint).toHaveBeenCalled();
    });
  });
});
