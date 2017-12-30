import Perfume from "../src/perfume";

/**
 * Perfume test
 */
describe("Perfume test", () => {
  let perfume;

  beforeAll(() => {
    window.performance = {
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName
      getEntriesByName: () => {
        return [12345];
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
    };
  });

  beforeEach(() => {
    perfume = new Perfume();
  });

  beforeEach(() => {
    spyOn(console, "log").and.callThrough();
    spyOn(console, "warn").and.callThrough();
    spyOn(perfume, "getFirstPaint").and.callThrough();
    spyOn(perfume, "log").and.callThrough();
  });

  it("should initialize correctly in the constructor", () => {
    expect(perfume.metrics).toEqual({});
    expect(perfume.logPrefix).toEqual("⚡️ Perfume.js:");
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
      expect(value).toEqual(12345);
    });
  });

  it("has 'getDurationByMetric' method after initialization", () => {
    expect(perfume.getDurationByMetric).toBeDefined();
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

  it("has 'start' method after initialization", () => {
    expect(perfume.start).toBeDefined();
  });

  describe("when calls start()", () => {
    it("should not throw a console.warn if param is correct", () => {
      perfume.start("metricName");
      expect(global.console.warn).not.toHaveBeenCalled();
    });
  });

  it("has 'end' method after initialization", () => {
    expect(perfume.end).toBeDefined();
  });

  describe("when calls end()", () => {
    it("should not throw a console.warn if param is correct", () => {
      perfume.start("metricName");
      perfume.end("metricName");
      expect(global.console.warn).not.toHaveBeenCalled();
    });

    it("should not throw a console.warn if param is correct", () => {
      perfume.end("metricName");
      expect(global.console.warn).toHaveBeenCalled();
    });
  });

  it("has 'getFirstPaint' method after initialization", () => {
    expect(perfume.getFirstPaint).toBeDefined();
  });

  describe("when calls getFirstPaint()", () => {
    it("should return null if the browser doesn't supports the Navigation Timing API", () => {
      const performance = perfume.getFirstPaint();
      expect(performance).toEqual(null);
    });
  });

  it("has 'firstPaint' method after initialization", () => {
    expect(perfume.firstPaint).toBeDefined();
  });

  describe("when calls firstPaint()", () => {
    it("should call getFirstPaint() after the first setTimeout", () => {
      perfume.firstPaint();
      setTimeout(() => {
        expect(perfume.getFirstPaint).toHaveBeenCalled();
      });
    });

    it("should call log() after the first setTimeout", () => {
      perfume.firstPaint();
      setTimeout(() => {
        expect(perfume.log).toHaveBeenCalled();
      });
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
});
