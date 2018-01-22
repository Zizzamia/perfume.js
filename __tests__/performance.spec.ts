import Performance from "../src/performance";

/**
 * Performance test
 */
describe("Performance test", () => {
  let service;

  beforeEach(() => {
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
    window.PerformanceLongTaskTiming = {};
    window.PerformanceObserver = function() {
      this.observe = () => {
        return {};
      };
    };
    service = new Performance();
  });

  beforeEach(() => {
    spyOn(console, "log").and.callThrough();
    spyOn(console, "warn").and.callThrough();
    spyOn(window.performance, "mark").and.callThrough();
    spyOn(window.performance, "measure").and.callThrough();
    spyOn(window, "PerformanceObserver").and.callThrough();
    spyOn(service, "getMeasurementForGivenName").and.callThrough();
    spyOn(service, "performanceNow").and.callThrough();
    spyOn(service, "mark").and.callThrough();
    spyOn(service, "measure").and.callThrough();
    spyOn(service, "getFirstPaint").and.callThrough();
  });

  it("should not throw a console.warn if window.performance is supported", () => {
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  it("Performance is instantiable", () => {
    expect(service).toBeInstanceOf(Performance);
  });

  it("has 'supportsPerfNow' method after initialization", () => {
    expect(service.supportsPerfNow).toBeDefined();
  });

  describe("when calls supportsPerfNow()", () => {
    it("should return true if the browser supports the Navigation Timing API", () => {
      expect(service.supportsPerfNow).toEqual(true);
    });
  });

  it("has 'supportsPerfMark' method after initialization", () => {
    expect(service.supportsPerfMark).toBeDefined();
  });

  describe("when calls supportsPerfMark()", () => {
    it("should return true if the browser supports the User Timing API", () => {
      expect(service.supportsPerfMark).toEqual(true);
    });
  });

  it("has 'supportsPerfObserver' method after initialization", () => {
    expect(service.supportsPerfObserver).toBeDefined();
  });

  describe("when calls supportsPerfObserver()", () => {
    it("should return true if the browser supports the PerformanceObserver Interface", () => {
      expect(service.supportsPerfObserver).toEqual(true);
    });
  });

  it("has 'getMeasurementForGivenName' method after initialization", () => {
    expect(service.getMeasurementForGivenName).toBeDefined();
  });

  describe("when calls getMeasurementForGivenName()", () => {
    it("should return the first PerformanceEntry objects for the given name", () => {
      const value = service.getMeasurementForGivenName("metricName");
      expect(value).toEqual({
        duration: 12345,
        entryType: "measure",
      });
    });
  });

  it("has 'performanceNow' method after initialization", () => {
    expect(service.performanceNow).toBeDefined();
  });

  it("has 'mark' method after initialization", () => {
    expect(service.mark).toBeDefined();
  });

  describe("when calls mark()", () => {
    it("should call window.performance.mark if the browser does supports the Mark Timing API", () => {
      service.mark();
      expect(window.performance.mark).toHaveBeenCalled();
    });
  });

  it("has 'measure' method after initialization", () => {
    expect(service.measure).toBeDefined();
  });

  describe("when calls measure()", () => {
    it("should call window.performance.measure if the browser does supports the Mark Timing API", () => {
      service.measure();
      expect(window.performance.measure).toHaveBeenCalled();
    });

    it("should not call window.performance.measure if the browser doesn't supports the Mark Timing API", () => {
      window.performance.mark = null;
      service.measure();
      expect(window.performance.measure).not.toHaveBeenCalled();
    });
  });

  it("has 'initPerformanceObserver' method after initialization", () => {
    expect(service.initPerformanceObserver).toBeDefined();
  });

  describe("when calls initPerformanceObserver()", () => {
    it("should call window.PerformanceObserver", () => {
      service.initPerformanceObserver();
      expect(window.PerformanceObserver).toHaveBeenCalled();
    });
  });

  it("has 'getFirstPaint' method after initialization", () => {
    expect(service.getFirstPaint).toBeDefined();
  });

  describe("when calls getFirstPaint()", () => {
    it("should return 0 if the browser doesn't supports the Navigation Timing API", () => {
      window.performance = null;
      const performance = service.getFirstPaint();
      expect(performance).toEqual(0);
    });

    it("should return 0 if PerformanceTiming.navigationStar is 0", () => {
      window.performance = {
        timing: {
          navigationStart: 0,
        },
      };
      const performance = service.getFirstPaint();
      expect(performance).toEqual(0);
    });

    it("should return the firstContentfulPaint value if the browser supports the Navigation Timing API", () => {
      const performance = service.getFirstPaint();
      expect(performance).toEqual(11111);
    });
  });

  it("has 'performanceObserverCb' method after initialization", () => {
    expect(service.performanceObserverCb).toBeDefined();
  });

  describe("when calls performanceObserverCb()", () => {
    it("should call callback", () => {
      const entryList = {
        getEntries: () => {
          return [{ name: "first-contentful-paint", startTime: 1}];
        },
      };
      service.performanceObserverCb(service.getFirstPaint, entryList);
      expect(service.getFirstPaint).toHaveBeenCalled();
    });
  });
});
