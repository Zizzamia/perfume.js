/**
 * @jest-environment jsdom
 */
import { WP } from '../../src/constants';
import mock from '../_mock';
import { initPerfume } from '../../src/initPerfume';
import { markStep, end } from '../../src/steps/markStep';
import { steps } from '../../src/steps/steps';

import { testConfig, navigationTestConfig } from '../stepsTestConstants';
import { config } from '../../src/config';

describe('markStep', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    (WP as any) = mock.performance();
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    initPerfume(testConfig);
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('markStep()', () => {
    it('correctly sets the activeSteps maps', () => {
      spy = jest.spyOn(WP, 'mark');
      markStep('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(
        'mark.start_navigate_to_second_screen_first_journey',
      );
      expect(steps.active).toMatchObject({
        load_second_screen_first_journey: true,
      });
    });

    it('using the markStepOnce function should call WP.mark with the journey name', () => {
      spy = jest.spyOn(WP, 'mark');
      markStep('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(
        'mark.start_navigate_to_second_screen_first_journey',
      );
    });
    it('shouldnt mark anything if performance is not supported', () => { 
      spy = jest.spyOn(WP, 'mark');
      // @ts-ignore
      delete window.performance.mark;
      markStep('start_navigate_to_second_screen_first_journey');
      expect(spy.mock.calls.length).toBe(0);
      end('test');
      expect(spy.mock.calls.length).toBe(0);
    })
    
  });
});
