import Perfume from "../src/perfume";

/**
 * Perfume test
 */
describe("Perfume test", () => {
  let perfume;

  beforeEach(() => {
    window.ga = undefined;
    window.Date = {
      now: () => {
        return 23456;
      },
    };
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
    perfume = new Perfume();
  });

  beforeEach(() => {
    spyOn(console, "log").and.callThrough();
    spyOn(console, "warn").and.callThrough();
    spyOn(perfume, "getMeasurementForGivenName").and.callThrough();
    spyOn(perfume, "getFirstPaint").and.callThrough();
    spyOn(perfume, "log").and.callThrough();
    spyOn(perfume, "sendTiming").and.callThrough();
  });

  it("should initialize correctly in the constructor", () => {
    expect(perfume.firstPaintDuration).toEqual(0);
    expect(perfume.googleAnalytics).toEqual({
      enable: false,
      timingVar: "name",
    });
    expect(perfume.metrics).toEqual({});
    expect(perfume.logPrefix).toEqual("⚡️ Perfume.js:");
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

  it("has 'supportsPerfNow' method after initialization", () => {
    expect(perfume.supportsPerfNow).toBeDefined();
  });

  describe("when calls supportsPerfNow()", () => {
    it("should return true if the browser supports the Navigation Timing API", () => {
      expect(perfume.supportsPerfNow).toEqual(true);
    });
  });

  it("has 'supportsPerfMark' method after initialization", () => {
    expect(perfume.supportsPerfMark).toBeDefined();
  });

  describe("when calls supportsPerfMark()", () => {
    it("should return true if the browser supports the User Timing API", () => {
      expect(perfume.supportsPerfMark).toEqual(true);
    });
  });

  it("has 'getMeasurementForGivenName' method after initialization", () => {
    expect(perfume.getMeasurementForGivenName).toBeDefined();
  });

  describe("when calls getMeasurementForGivenName()", () => {
    it("should return the first PerformanceEntry objects for the given name", () => {
      const value = perfume.getMeasurementForGivenName("metricName");
      expect(value).toEqual({
        duration: 12345,
        entryType: "measure",
      });
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

  it("has 'performanceNow' method after initialization", () => {
    expect(perfume.performanceNow).toBeDefined();
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

    it("should not throw a console.warn if param is correct", () => {
      perfume.start("metricName");
      perfume.end("metricName");
      expect(global.console.warn).not.toHaveBeenCalled();
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

  it("has 'getFirstPaint' method after initialization", () => {
    expect(perfume.getFirstPaint).toBeDefined();
  });

  describe("when calls getFirstPaint()", () => {
    it("should return null if the browser doesn't supports the Navigation Timing API", () => {
      window.performance = null;
      const performance = perfume.getFirstPaint();
      expect(performance).toEqual(0);
    });

    it("should return null if the browser doesn't supports the Navigation Timing API", () => {
      const performance = perfume.getFirstPaint();
      expect(performance).toEqual(11111);
    });
  });

  it("has 'firstPaint' method after initialization", () => {
    expect(perfume.firstPaint).toBeDefined();
  });

  describe("when calls firstPaint()", () => {

    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("should call getFirstPaint() after the first setTimeout", () => {
      perfume.firstPaint();
      jest.runAllTimers();
      expect(perfume.getFirstPaint).toHaveBeenCalled();
    });

    it("should call log() after the first setTimeout", () => {
      perfume.firstPaint();
      jest.runAllTimers();
      expect(perfume.log).toHaveBeenCalled();
    });

    it("should call sendTiming() after the first setTimeout", () => {
      perfume.firstPaint();
      jest.runAllTimers();
      expect(perfume.sendTiming).toHaveBeenCalled();
    });

    it("should perfume.firstPaintDuration be equal", () => {
      perfume.firstPaint();
      jest.runAllTimers();
      expect(perfume.firstPaintDuration).toEqual(11111);
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

  it("has 'sendTiming' method after initialization", () => {
    expect(perfume.sendTiming).toBeDefined();
  });

  describe("when calls sendTiming()", () => {
    it("should not call global.console.warn() if googleAnalytics is disable", () => {
      perfume.sendTiming();
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should call global.console.warn() if googleAnalytics is disable", () => {
      perfume.googleAnalytics.enable = true;
      perfume.sendTiming();
      expect(global.console.warn).toHaveBeenCalled();
    });

    it("should not call global.console.warn() if googleAnalytics is enable and ga is present", () => {
      perfume.googleAnalytics.enable = true;
      window.ga = () => {
        return true;
      };
      perfume.sendTiming("metricName", 123);
      expect(global.console.warn).not.toHaveBeenCalled();
    });
  });
});
