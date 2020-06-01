import { config } from '../src/config';
import { WP } from '../src/constants';
import { initLayoutShift } from '../src/cumulativeLayoutShift';
import * as firstInput from '../src/firstInput';
import { initResourceTiming } from '../src/resourceTiming';
import * as log from '../src/log';
import {
  disconnectPerfObserversHidden,
  initPerformanceObserver,
} from '../src/observe';
import { perfObservers } from '../src/observeInstances';
import * as paint from '../src/paint';
import * as po from '../src/performanceObserver';
import mock from './_mock';

describe('observe', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    config.isResourceTiming = false;
    config.isElementTiming = false;
    jest.spyOn(paint, 'initFirstPaint').mockImplementation(() => { });
    jest.spyOn(firstInput, 'initFirstInputDelay').mockImplementation(() => { });
    jest
      .spyOn(paint, 'initLargestContentfulPaint')
      .mockImplementation(() => { });
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe(".initPerformanceObserver()", () => {
    describe.each`
      resourceTiming | elementTiming | calls
      ${false}       | ${false}      | ${4}
      ${true}        | ${false}      | ${5}
      ${false}       | ${true}       | ${5}
      ${true}        | ${true}       | ${6}
    `(
      "when resourceTiming is $resourceTiming and elementTiming is $elementTiming",
      ({ resourceTiming, elementTiming, calls }) => {
        beforeEach(() => {
          config.isResourceTiming = resourceTiming;
          config.isElementTiming = elementTiming;

          spy = jest.spyOn(po, "po");
          initPerformanceObserver();
        });

        it(`should call po $calls times`, () => {
          expect(spy.mock.calls.length).toEqual(calls);
          expect(spy).toHaveBeenCalledWith("paint", paint.initFirstPaint);
          expect(spy).toHaveBeenCalledWith(
            "first-input",
            firstInput.initFirstInputDelay
          );
          expect(spy).toHaveBeenCalledWith(
            "largest-contentful-paint",
            paint.initLargestContentfulPaint
          );
          expect(spy).toHaveBeenCalledWith("layout-shift", initLayoutShift);
        });

        it("should only call po for resource timing when is enabled", () => {
          if (config.isResourceTiming) {
            expect(spy).toHaveBeenCalledWith("resource", initResourceTiming);
          } else {
            expect(spy).not.toHaveBeenCalledWith("resource", initResourceTiming);
          }
        });

        it("should only call po for element timing when is enabled", () => {
          if (config.isElementTiming) {
            expect(spy).toHaveBeenCalledWith("element", paint.initElementTiming);
          } else {
            expect(spy).not.toHaveBeenCalledWith(
              "element",
              paint.initElementTiming
            );
          }
        });
      }
    );
  });

  describe('.disconnectPerfObserversHidden()', () => {
    it('should call logMetric', () => {
      perfObservers[2] = { disconnect: jest.fn() };
      perfObservers[3] = { disconnect: jest.fn(), takeRecords: jest.fn() };
      perfObservers[4] = { disconnect: jest.fn() };
      spy = jest.spyOn(log, 'logMetric');
      disconnectPerfObserversHidden();
      expect(spy.mock.calls.length).toEqual(3);
    });
  });
});
