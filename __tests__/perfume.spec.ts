import Perfume from "../src/perfume";

/**
 * Perfume test
 */
describe("Perfume test", () => {
  let perfume;

  beforeEach(() => {
    window.ga = undefined;
    window.performance = {
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName
      getEntriesByName: () => {
        return [{
          duration: 12345,
          entryType: "measure",
        }];
      },
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark
      mark: () => {
        return 12345;
      },
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure
      measure: () => {
        return 12345;
      },
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
      now: Date.now,
      timing: {
        navigationStart: 12345,
      },
    };
    window.PerformanceLongTaskTiming = {};
    window.PerformanceObserver = function() {
      this.observe = () => {
        return {};
      };
    };
    perfume = new Perfume();
    perfume.perf.ttiPolyfill = {
      getFirstConsistentlyInteractive: () => {
        return new Promise((resolve) => {
          resolve();
        });
      },
    };
  });

  beforeEach(() => {
    spyOn(console, "log").and.callThrough();
    spyOn(console, "warn").and.callThrough();
    spyOn(perfume, "start").and.callThrough();
    spyOn(perfume, "end").and.callThrough();
    spyOn(perfume, "endPaint").and.callThrough();
    spyOn(perfume, "log").and.callThrough();
    spyOn(perfume, "checkMetricName").and.callThrough();
    spyOn(perfume, "firstContentfulPaintCb").and.callThrough();
    spyOn(perfume, "timeToInteractiveCb").and.callThrough();
    spyOn(perfume, "logFCP").and.callThrough();
    spyOn(perfume, "sendTiming").and.callThrough();
  });

  describe("when calls start()", () => {
    it("should throw a console.warn if metricName is not passed", () => {
      perfume.start();
      expect(global.console.warn.calls.count()).toEqual(1);
      expect(global.console.warn).toHaveBeenCalledWith("⚡️ Perfume.js:", "Please provide a metric name");
    });

    it("should not throw a console.warn if param is correct", () => {
      perfume.start("metricName");
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should throw a console.warn if recording already started", () => {
      perfume.start("metricName");
      perfume.start("metricName");
      expect(global.console.warn.calls.count()).toEqual(1);
      expect(global.console.warn).toHaveBeenCalledWith("⚡️ Perfume.js:", "Recording already started.");
    });
  });

  describe("when calls end()", () => {
    it("should throw a console.warn if param is not correct", () => {
      perfume.end();
      expect(global.console.warn.calls.count()).toEqual(1);
      expect(global.console.warn).toHaveBeenCalledWith("⚡️ Perfume.js:", "Please provide a metric name");
    });

    it("should throw a console.warn if param is correct and recording already stopped", () => {
      perfume.end("metricName");
      expect(global.console.warn.calls.count()).toEqual(1);
      expect(global.console.warn).toHaveBeenCalledWith("⚡️ Perfume.js:", "Recording already stopped.");
    });

    it("should call log() if log param is true", () => {
      perfume.start("metricName");
      perfume.end("metricName", true);
      expect(perfume.log.calls.count()).toEqual(1);
      expect(perfume.log).toHaveBeenCalledWith("metricName", -1);
    });

    it("should not call log() when logging is false", () => {
      perfume.config.logging = false;
      perfume.start("metricName");
      perfume.end("metricName", true);
      expect(perfume.log).not.toHaveBeenCalled();
    });
  });

  describe("when calls start() and end()", () => {
    beforeEach(() => {
      spyOn(perfume.perf, "mark").and.callThrough();
      spyOn(perfume.perf, "measure").and.callThrough();
      perfume.start("metricName");
      perfume.end("metricName");
    });

    it("should not throw a console.warn if param is correct", () => {
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should call perf.mark() twice with the correct arguments", () => {
      expect(perfume.perf.mark.calls.count()).toEqual(2);
    });

    it("should call perf.measure() with the correct arguments", () => {
      expect(perfume.perf.measure.calls.count()).toEqual(1);
      expect(perfume.perf.measure).toHaveBeenCalledWith("metricName", {});
    });
  });

  describe("when calls endPaint()", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("should call end() after the first setTimeout", () => {
      perfume.endPaint();
      jest.runAllTimers();
      expect(perfume.end.calls.count()).toEqual(1);
    });
  });

  describe("when calls log()", () => {
    it("should call global.console.warn() if params are not correct", () => {
      perfume.log();
      const text = "Please provide a metric name and the duration value";
      expect(global.console.warn.calls.count()).toEqual(1);
      expect(global.console.warn).toHaveBeenCalledWith(perfume.config.logPrefix, text);
    });

    it("should not call global.console.log() if params are not correct", () => {
      perfume.log();
      expect(global.console.log).not.toHaveBeenCalled();
    });

    it("should call global.console.log() if params are correct", () => {
      perfume.log("metricName", 12345);
      const text = "%c ⚡️ Perfume.js: metricName 12345.00 ms";
      const style = "color: #ff6d00;font-size:12px;";
      expect(global.console.log.calls.count()).toEqual(1);
      expect(global.console.log).toHaveBeenCalledWith(text, style);
    });
  });

  describe("when calls checkMetricName()", () => {
    it("should return 'true' when provided a metric name", () => {
      const value = perfume.checkMetricName("metricName");
      expect(value).toEqual(true);
    });

    it("should return 'false' when not provided a metric name", () => {
      const value = perfume.checkMetricName();
      expect(value).toEqual(false);
    });
  });

  describe("when calls firstContentfulPaintCb()", () => {
    let entry;

    beforeEach(() => {
      spyOn(perfume.perf, "timeToInteractive").and.callThrough();
      entry = {
        name: "first-contentful-paint",
        startTime: 1,
      };
      perfume.config.firstContentfulPaint = true;
      perfume.config.timeToInteractive = true;
    });

    it("should call logFCP() with the correct arguments", () => {
      perfume.firstContentfulPaintCb(entry);
      expect(perfume.logFCP.calls.count()).toEqual(1);
      expect(perfume.logFCP).toHaveBeenCalledWith(1);
    });

    it("should not call logFCP() when firstContentfulPaint is false", () => {
      perfume.config.firstContentfulPaint = false;
      perfume.firstContentfulPaintCb(entry);
      expect(perfume.logFCP).not.toHaveBeenCalled();
    });

    it("should call timeToInteractive()", () => {
      perfume.firstContentfulPaintCb(entry);
      expect(perfume.perf.timeToInteractive.calls.count()).toEqual(1);
    });
  });

  describe("when calls timeToInteractiveCb()", () => {
    beforeEach(() => {
      perfume.config.timeToInteractiveCb = () => {
        return "";
      };
      spyOn(perfume.config, "timeToInteractiveCb").and.callThrough();
    });

    it("should call log() with the correct arguments", () => {
      perfume.timeToInteractiveCb(1);
      expect(perfume.log.calls.count()).toEqual(1);
      expect(perfume.log).toHaveBeenCalledWith("Time to interactive", perfume.timeToInteractiveDuration);
    });

    it("should call sendTiming() with the correct arguments", () => {
      perfume.timeToInteractiveCb(1);
      expect(perfume.sendTiming.calls.count()).toEqual(1);
      expect(perfume.sendTiming).toHaveBeenCalledWith("timeToInteractive", perfume.timeToInteractiveDuration);
    });

    it("should perfume.timeToInteractiveDuration be equal to 1", () => {
      perfume.timeToInteractiveCb(1);
      expect(perfume.timeToInteractiveDuration).toEqual(1);
    });

    it("should call timeToInteractiveCb()", () => {
      perfume.timeToInteractiveCb(1);
      expect(perfume.config.timeToInteractiveCb.calls.count()).toEqual(1);
      expect(perfume.config.timeToInteractiveCb).toHaveBeenCalledWith(perfume.timeToInteractiveDuration);
    });
  });

  describe("when calls logFCP()", () => {
    it("should call log() with the correct arguments", () => {
      perfume.logFCP(1);
      expect(perfume.log.calls.count()).toEqual(1);
      expect(perfume.log).toHaveBeenCalledWith("First Contentful Paint", perfume.firstContentfulPaintDuration);
    });

    it("should call sendTiming() with the correct arguments", () => {
      perfume.logFCP(1);
      expect(perfume.sendTiming.calls.count()).toEqual(1);
      expect(perfume.sendTiming).toHaveBeenCalledWith("firstContentfulPaint", perfume.firstContentfulPaintDuration);
    });

    it("should perfume.firstContentfulPaintDuration be equal to duration", () => {
      perfume.logFCP(1);
      expect(perfume.firstContentfulPaintDuration).toEqual(1);
    });
  });

  describe("when calls sendTiming()", () => {
    it("should not call global.console.warn() if googleAnalytics is disable", () => {
      perfume.sendTiming();
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should call global.console.warn() if googleAnalytics is disable with the correct arguments", () => {
      perfume.config.googleAnalytics.enable = true;
      perfume.sendTiming();
      const text = "Google Analytics has not been loaded";
      expect(global.console.warn.calls.count()).toEqual(1);
      expect(global.console.warn).toHaveBeenCalledWith(perfume.config.logPrefix, text);
    });

    it("should not call global.console.warn() if googleAnalytics is enable and ga is present", () => {
      perfume.config.googleAnalytics.enable = true;
      window.ga = () => {
        return true;
      };
      perfume.sendTiming("metricName", 123);
      expect(global.console.warn).not.toHaveBeenCalled();
    });
  });
});
