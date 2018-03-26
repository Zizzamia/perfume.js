import Performance from "../src/performance";

/**
 * Performance test
 */
describe("Performance test", () => {
  let service;

  beforeEach(() => {
    window.performance = {
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName
      getEntriesByName: () => {
        return [{
          duration: 12345,
          entryType: "measure",
        }, {
          duration: 12346,
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
    service.ttiPolyfill = {
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
    spyOn(window.performance, "now").and.callThrough();
    spyOn(window, "PerformanceObserver").and.callThrough();
    spyOn(Performance, "supported").and.callThrough();
    spyOn(Performance, "supportedLongTask").and.callThrough();
    spyOn(service.ttiPolyfill, "getFirstConsistentlyInteractive").and.callThrough();
    spyOn(service, "now").and.callThrough();
    spyOn(service, "mark").and.callThrough();
    spyOn(service, "measure").and.callThrough();
    spyOn(service, "firstContentfulPaint").and.callThrough();
    spyOn(service, "getDurationByMetric").and.callThrough();
    spyOn(service, "getMeasurementForGivenName").and.callThrough();
    spyOn(service, "performanceObserverCb").and.callThrough();
    spyOn(service, "timeToInteractive").and.callThrough();
  });

  describe("when calls supported()", () => {
    it("should return true if the browser supports the Navigation Timing API", () => {
      expect(Performance.supported()).toEqual(true);
    });

    it("should return false if the browser doesn't supports performance.mark", () => {
      window.performance.mark = undefined;
      expect(Performance.supported()).toEqual(false);
    });

    it("should return false if the browser doesn't supports performance.now", () => {
      window.performance.mark = () => {
        return 1;
      };
      window.performance.now = undefined;
      expect(Performance.supported()).toEqual(false);
    });
  });

  describe("when calls now()", () => {
    it("should call window.performance.now", () => {
      service.now();
      expect(window.performance.now.calls.count()).toEqual(1);
    });
  });

  describe("when calls mark()", () => {
    it("should call window.performance.mark with the correct argument", () => {
      service.mark("fibonacci");
      expect(window.performance.mark.calls.count()).toEqual(1);
      expect(window.performance.mark).toHaveBeenCalledWith("mark_fibonacci_undefined");
    });
  });

  describe("when calls measure()", () => {
    it("should call window.performance.measure with the correct arguments", () => {
      service.measure("fibonacci");
      const start = "mark_fibonacci_start";
      const end = "mark_fibonacci_end";
      expect(window.performance.measure.calls.count()).toEqual(1);
      expect(window.performance.measure).toHaveBeenCalledWith("fibonacci", start, end);
    });

    it("should call getDurationByMetric with the correct arguments", () => {
      service.measure("fibonacci", {});
      expect(service.getDurationByMetric.calls.count()).toEqual(1);
      expect(service.getDurationByMetric).toHaveBeenCalledWith("fibonacci", {});
    });
  });

  describe("when calls firstContentfulPaint()", () => {
    it("should call initPerformanceObserver()", () => {
      service.firstContentfulPaint();
      expect(window.PerformanceObserver.calls.count()).toEqual(1);
    });
  });

  describe("when calls getDurationByMetric()", () => {
    it("should return entry.duration when entryType is not measure", () => {
      window.performance.getEntriesByName = () => {
        return [{
          duration: 12345,
          entryType: "notMeasure",
        }];
      };
      const value = service.getDurationByMetric("metricName");
      expect(value).toEqual(-1);
    });

    it("should return -1 when entryType is a measure", () => {
      window.performance.getEntriesByName = () => {
        return [{
          duration: 12345,
          entryType: "measure",
        }, {
          duration: 12346,
          entryType: "measure",
        }];
      };
      const value = service.getDurationByMetric("metricName");
      expect(value).toEqual(12346);
    });
  });

  describe("when calls getMeasurementForGivenName()", () => {
    it("should return the first PerformanceEntry objects for the given name", () => {
      const value = service.getMeasurementForGivenName("metricName");
      expect(value).toEqual({
        duration: 12346,
        entryType: "measure",
      });
    });
  });

  describe("when calls performanceObserverCb()", () => {
    let entryList;

    beforeEach(() => {
      service.callback = () => {
        return 1;
      };
      service.perfObserver = {
        disconnect: () => {
          return true;
        },
      };
      entryList = {
        getEntries: () => {
          return [{ name: "first-contentful-paint", startTime: 1}];
        },
      };
      service.config = {};
      spyOn(service, "callback").and.callThrough();
      spyOn(service.perfObserver, "disconnect").and.callThrough();
    });

    it("should call callback with the correct argument", () => {
      service.performanceObserverCb(service.callback, entryList);
      expect(service.callback.calls.count()).toEqual(1);
      expect(service.callback).toHaveBeenCalledWith([{ name: "first-contentful-paint", startTime: 1}]);
    });

    it("should call perfObserver.disconnect", () => {
      service.config.firstContentfulPaint = true;
      service.performanceObserverCb(service.callback, entryList);
      expect(service.perfObserver.disconnect.calls.count()).toEqual(1);
    });

    describe("when entries is empty", () => {
      it("should not call perfObserver.disconnect ", () => {
        entryList = {
          getEntries: () => {
            return [];
          },
        };
        service.performanceObserverCb(service.callback, entryList);
        expect(service.perfObserver.disconnect.calls.count()).toEqual(0);
      });
    });
  });

  describe("when calls timeToInteractive()", () => {
    it("should call ttiPolyfill with the correct argument", () => {
      service.timeToInteractive(10);
      expect(service.ttiPolyfill.getFirstConsistentlyInteractive.calls.count()).toEqual(1);
      expect(service.ttiPolyfill.getFirstConsistentlyInteractive).toHaveBeenCalledWith({ minValue: 10 });
    });
  });
});
