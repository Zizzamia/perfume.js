/**
 * @jest-environment jsdom
 */
import { config } from '../src/config';
import { WP } from '../src/constants';
import { initResourceTiming } from '../src/resourceTiming';
import { initPerformanceObserver } from '../src/observe';
import { initElementTiming } from '../src/element-timing';
import * as po from '../src/performanceObserver';
import mock from './_mock';

describe('observe', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    config.isResourceTiming = false;
    config.isElementTiming = false;
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('initPerformanceObserver()', () => {
    describe.each`
      resourceTiming | elementTiming | calls
      ${false}       | ${false}      | ${0}
      ${true}        | ${false}      | ${1}
      ${false}       | ${true}       | ${1}
      ${true}        | ${true}       | ${2}
    `(
      'when resourceTiming is $resourceTiming and elementTiming is $elementTiming',
      ({ resourceTiming, elementTiming, calls }) => {
        beforeEach(() => {
          config.isResourceTiming = resourceTiming;
          config.isElementTiming = elementTiming;

          spy = jest.spyOn(po, 'po');
          initPerformanceObserver();
        });

        it(`should call po $calls times`, () => {
          expect(spy.mock.calls.length).toEqual(calls);
        });

        it('should only call po for resource timing when is enabled', () => {
          if (config.isResourceTiming) {
            expect(spy).toHaveBeenCalledWith('resource', initResourceTiming);
          } else {
            expect(spy).not.toHaveBeenCalledWith(
              'resource',
              initResourceTiming,
            );
          }
        });

        it('should only call po for element timing when is enabled', () => {
          if (config.isElementTiming) {
            expect(spy).toHaveBeenCalledWith('element', initElementTiming);
          } else {
            expect(spy).not.toHaveBeenCalledWith('element', initElementTiming);
          }
        });
      },
    );
  });
});
