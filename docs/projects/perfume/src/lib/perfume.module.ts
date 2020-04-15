import {
  AfterViewInit,
  Inject,
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import Perfume, { IPerfumeConfig } from 'perfume.js';
// type ILogOptions = any;
// type IPerfumeConfig = any;
// type ISendTimingOptions = any;
// import Perfume from '../../../../../dist/perfume.min';

export let perfume;

export const PERFUME_CONFIG = new InjectionToken('Perfume.js config');

@NgModule({})
export class PerfumeRootModule {
  constructor(@Inject(PERFUME_CONFIG) public config: IPerfumeConfig) {
    perfume = new Perfume(config);
  }
}

@Injectable()
export class NgPerfume {
  perfume: Perfume;
  config: IPerfumeConfig;

  constructor() {
    this.config = perfume.config;
  }

  start(metricName: string): void {
    perfume.start(metricName);
  }

  end(metricName: string): void {
    perfume.end(metricName);
  }

  endPaint(metricName: string): void {
    perfume.endPaint(metricName);
  }
}

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
})
export class PerfumeModule {
  public static forRoot(config: any): ModuleWithProviders<PerfumeRootModule> {
    return {
      ngModule: PerfumeRootModule,
      providers: [
        {
          provide: PERFUME_CONFIG,
          useValue: config,
        },
        NgPerfume,
      ],
    };
  }
}

/**
 * Describes any Angular component class that implements `AfterViewInit`.
 */
// tslint:disable-next-line:interface-name
export interface AfterViewInitable {
  prototype: AfterViewInit;
  new(...args: any[]): AfterViewInit;
}

/**
 * Component View Init (CVI) decorator
 * Marks the time between the constructor is initialized,
 * and ngAfterViewInit execution ends.
 */
// tslint:disable-next-line:function-name
export function PerfumeAfterViewInit(targetName?: string) {
  return function DecoratorFactory(target: AfterViewInitable) {
    // The new constructor behavior, supports AOT and DI
    const newConstructor: any = function newCtor(...args) {
      perfume.start(targetName || target.name);
      const c: any = function childConstuctor() {
        return target.apply(this, arguments);
      };
      c.prototype = Object.create(target.prototype);
      return new c(...args);
    };

    // The new ngAfterViewInit behavior
    const ngAfterViewInit = target.prototype.ngAfterViewInit;
    target.prototype.ngAfterViewInit = function (...args) {
      // tslint:disable-next-line:no-unused-expression
      ngAfterViewInit && ngAfterViewInit.apply(this, args);
      perfume.end(targetName || target.name);
    };

    // Copy prototype so instanceof operator still works
    newConstructor.prototype = Object.create(target.prototype);

    // Return new constructor (will override original)
    return newConstructor;
  };
}
