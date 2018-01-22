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
    perfume.ttiPolyfill = {
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
    spyOn(window.performance, "mark").and.callThrough();
    spyOn(window.performance, "measure").and.callThrough();
    spyOn(perfume.ttiPolyfill, "getFirstConsistentlyInteractive").and.callThrough();
    spyOn(perfume, "end").and.callThrough();
    spyOn(perfume, "log").and.callThrough();
    spyOn(perfume, "getMeasurementForGivenName").and.callThrough();
    spyOn(perfume, "getDurationByMetric").and.callThrough();
    spyOn(perfume, "checkMetricName").and.callThrough();
    spyOn(perfume, "performanceNow").and.callThrough();
    spyOn(perfume, "mark").and.callThrough();
    spyOn(perfume, "measure").and.callThrough();
    spyOn(perfume, "getFirstPaint").and.callThrough();
    spyOn(perfume, "initPerformanceObserver");
    spyOn(perfume, "timeFirstPaint").and.callThrough();
    spyOn(perfume, "logFCP").and.callThrough();
    spyOn(perfume, "timeToInteractive").and.callThrough();
    spyOn(perfume, "timeToInteractiveResolve").and.callThrough();
    spyOn(perfume, "sendTiming").and.callThrough();
  });

  it("should initialize correctly in the constructor", () => {
    expect(perfume.firstContentfulPaintDuration).toEqual(0);
    expect(perfume.timeToInteractiveDuration).toEqual(0);
    expect(perfume.config.googleAnalytics).toEqual({
      enable: false,
      timingVar: "name",
    });
    expect(perfume.metrics).toEqual({});
    expect(perfume.config.logPrefix).toEqual("⚡️ Perfume.js:");
  });

  it("should throw a console.warn if window.performance is not supported", () => {
    window.performance = null;
    perfume = new Perfume();
    expect(global.console.warn).toHaveBeenCalled();
  });

  it("should not throw a console.warn if window.performance is supported", () => {
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  it("Perfume is instantiable", () => {
    expect(perfume).toBeInstanceOf(Perfume);
  });

  it("has 'start' method after initialization", () => {
    expect(perfume.start).toBeDefined();
  });

  describe("when calls start()", () => {
    it("should throw a console.warn if metricName is not passed", () => {
      perfume.start();
      expect(global.console.warn).toHaveBeenCalled();
    });

    it("should not throw a console.warn if param is correct", () => {
      perfume.start("metricName");
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should throw a console.warn if window.performance is not supported", () => {
      window.performance = null;
      perfume.start("metricName");
      expect(global.console.warn).toHaveBeenCalled();
    });

    it("should throw a console.warn if recording already started", () => {
      perfume.start("metricName");
      perfume.start("metricName");
      expect(global.console.warn).toHaveBeenCalled();
    });
  });

  it("has 'end' method after initialization", () => {
    expect(perfume.end).toBeDefined();
  });

  describe("when calls end()", () => {
    it("should throw a console.warn if param is not correct", () => {
      perfume.end();
      expect(global.console.warn).toHaveBeenCalled();
    });

    it("should throw a console.warn if param is correct and recording already stopped", () => {
      perfume.end("metricName");
      expect(global.console.warn).toHaveBeenCalled();
    });

    it("should call log() if log param is true", () => {
      perfume.start("metricName");
      perfume.end("metricName", true);
      expect(perfume.log).toHaveBeenCalled();
    });
  });

  describe("when calls start() and end()", () => {
    beforeEach(() => {
      perfume.start("metricName");
      perfume.end("metricName");
    });

    it("should not throw a console.warn if param is correct", () => {
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should call mark()", () => {
      expect(perfume.mark).toHaveBeenCalled();
    });

    it("should call measure()", () => {
      expect(perfume.measure).toHaveBeenCalled();
    });
  });

  it("has 'endPaint' method after initialization", () => {
    expect(perfume.endPaint).toBeDefined();
  });

  describe("when calls endPaint()", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("should call end() after the first setTimeout", () => {
      perfume.endPaint();
      jest.runAllTimers();
      expect(perfume.end).toHaveBeenCalled();
    });
  });

  it("has 'log' method after initialization", () => {
    expect(perfume.log).toBeDefined();
  });

  describe("when calls log()", () => {
    it("should call global.console.warn() if params are not correct", () => {
      perfume.log();
      expect(global.console.warn).toHaveBeenCalled();
    });

    it("should not call global.console.log() if params are not correct", () => {
      perfume.log();
      expect(global.console.log).not.toHaveBeenCalled();
    });

    it("should call global.console.log() if params are correct", () => {
      perfume.log("metricName", 12345);
      expect(global.console.log).toHaveBeenCalled();
    });
  });

  it("has 'checkMetricName' method after initialization", () => {
    expect(perfume.checkMetricName).toBeDefined();
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

  it("has 'getDurationByMetric' method after initialization", () => {
    expect(perfume.getDurationByMetric).toBeDefined();
  });

  describe("when calls getDurationByMetric()", () => {
    it("should call getMeasurementForGivenName() if supportsPerfMark is true", () => {
      perfume.metrics.metricName = {
        end: 0,
        start: perfume.performanceNow(),
      };
      perfume.getDurationByMetric("metricName");
      expect(perfume.getMeasurementForGivenName).toHaveBeenCalled();
    });

    it("should return entry.duration when entryType is not measure", () => {
      perfume.metrics.metricName = {
        end: 0,
        start: perfume.performanceNow(),
      };
      window.performance.getEntriesByName = () => {
        return [{
          duration: 12345,
          entryType: "notMeasure",
        }];
      };
      const value = perfume.getDurationByMetric("metricName");
      expect(value).toEqual(12345);
    });

    it("should not call getMeasurementForGivenName() if supportsPerfMark is false", () => {
      window.performance = null;
      perfume.metrics.metricName = {
        end: 0,
        start: perfume.performanceNow(),
      };
      perfume.getDurationByMetric("metricName");
      expect(perfume.getMeasurementForGivenName).not.toHaveBeenCalled();
    });
  });

  it("has 'firstContentfulPaint' method after initialization", () => {
    expect(perfume.firstContentfulPaint).toBeDefined();
  });

  describe("when calls firstContentfulPaint()", () => {

    it("should call initPerformanceObserver()", () => {
      perfume.firstContentfulPaint();
      expect(perfume.initPerformanceObserver).toHaveBeenCalled();
    });

    it("should not call timeFirstPaint()", () => {
      perfume.firstContentfulPaint();
      expect(perfume.timeFirstPaint).not.toHaveBeenCalled();
    });
  });

  it("has 'observeFirstContentfulPaint' method after initialization", () => {
    expect(perfume.observeFirstContentfulPaint).toBeDefined();
  });

  describe("when calls observeFirstContentfulPaint()", () => {
    let entryList;

    beforeEach(() => {
      entryList = {
        getEntries: () => {
          return [{ name: "first-contentful-paint", startTime: 1}];
        },
      };
      perfume.config.firstContentfulPaint = true;
      perfume.config.timeToInteractive = true;
      perfume.observeFirstContentfulPaint(entryList);
    });

    it("should call logFCP()", () => {
      expect(perfume.logFCP).toHaveBeenCalled();
    });

    it("should call timeToInteractive()", () => {
      expect(perfume.timeToInteractive).toHaveBeenCalled();
    });
  });

  describe("when calls timeFirstPaint()", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("should call getFirstPaint() after the first setTimeout", () => {
      perfume.timeFirstPaint();
      jest.runAllTimers();
      expect(perfume.getFirstPaint).toHaveBeenCalled();
    });

    it("should call log() after the first setTimeout", () => {
      perfume.timeFirstPaint();
      jest.runAllTimers();
      expect(perfume.logFCP).toHaveBeenCalled();
    });
  });

  it("has 'logFCP' method after initialization", () => {
    expect(perfume.logFCP).toBeDefined();
  });

  describe("when calls logFCP()", () => {
    it("should call log()", () => {
      perfume.logFCP(1);
      expect(perfume.log).toHaveBeenCalled();
    });

    it("should call sendTiming()", () => {
      perfume.logFCP(1);
      expect(perfume.sendTiming).toHaveBeenCalled();
    });

    it("should perfume.firstContentfulPaintDuration be equal", () => {
      perfume.logFCP(1);
      expect(perfume.firstContentfulPaintDuration).toEqual(1);
    });
  });

  it("has 'timeToInteractive' method after initialization", () => {
    expect(perfume.timeToInteractive).toBeDefined();
  });

  it("has 'timeToInteractiveResolve' method after initialization", () => {
    expect(perfume.timeToInteractiveResolve).toBeDefined();
  });

  describe("when calls timeToInteractiveResolve()", () => {

    beforeEach(() => {
      perfume.config.timeToInteractiveCb = () => {
        return "";
      };
      spyOn(perfume.config, "timeToInteractiveCb").and.callThrough();
    });

    it("should call log()", () => {
      perfume.timeToInteractiveResolve(1);
      expect(perfume.log).toHaveBeenCalled();
    });

    it("should call sendTiming()", () => {
      perfume.timeToInteractiveResolve(1);
      expect(perfume.sendTiming).toHaveBeenCalled();
    });

    it("should perfume.timeToInteractiveDuration be equal to 1", () => {
      perfume.timeToInteractiveResolve(1);
      expect(perfume.timeToInteractiveDuration).toEqual(1);
    });

    it("should call timeToInteractiveCb()", () => {
      perfume.timeToInteractiveResolve(1);
      expect(perfume.config.timeToInteractiveCb).toHaveBeenCalled();
    });
  });

  it("has 'sendTiming' method after initialization", () => {
    expect(perfume.sendTiming).toBeDefined();
  });

  describe("when calls sendTiming()", () => {
    it("should not call global.console.warn() if googleAnalytics is disable", () => {
      perfume.sendTiming();
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should call global.console.warn() if googleAnalytics is disable", () => {
      perfume.config.googleAnalytics.enable = true;
      perfume.sendTiming();
      expect(global.console.warn).toHaveBeenCalled();
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
