import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';

import {
  navigationTiming,
  dataConsumption,
  fp,
  fcp,
  lcp,
  lcpFinal,
  fid,
  cls,
  clsFinal,
  tbt,
  tbt5s,
  tbt10s,
  tbtFinal,
  fibonacci,
  custom_fibonacci,
  networkInformation,
  isLowEndDevice$,
  isLowEndExperience$,
  navigatorInformation$,
  elHeroLogo,
  elPageTitle,
  perfume,
} from './perfume';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('p', { static: true })
  // Component
  navigationTiming: any = {};
  networkInformation = {
    effectiveType: '--',
    saveData: '--',
  };
  dataConsumption = {};
  logCustom: string;
  logFibonacci: string;
  fp: number;
  fcp: number;
  fid: number;
  lcp: number;
  lcpFinal: number;
  cls: number;
  clsFinal: number;
  tbt: number;
  tbt5s: number;
  tbt10s: number;
  tbtFinal: number;
  path: string;
  isLowEndDevice: boolean;
  isLowEndExperience: boolean;
  navigatorInformation: {
    deviceMemory: string | number;
    hardwareConcurrency: string | number;
  };
  elHeroLogo: number;
  elPageTitle: number;

  constructor(private ref: ChangeDetectorRef) {
    this.path = window.location.href.split('#')[0];
  }

  ngAfterViewInit() {
    navigationTiming.subscribe(result => {
      this.navigationTiming = JSON.stringify(result, undefined, 2);
      this.ref.detectChanges();
    });
    networkInformation.subscribe(result => {
      if (result?.effectiveType) {
        this.networkInformation.effectiveType = result.effectiveType;
      }
      if ('saveData' in result) {
        this.networkInformation.saveData = result.saveData;
      }
      this.ref.detectChanges();
    });
    navigatorInformation$.subscribe(result => {
      this.navigatorInformation = result;
      this.ref.detectChanges();
    });
    dataConsumption.subscribe(result => {
      this.dataConsumption = JSON.stringify(result, undefined, 2);
      this.ref.detectChanges();
    });
    fp.subscribe(result => {
      this.fp = result;
      this.ref.detectChanges();
    });
    fcp.subscribe(result => {
      this.fcp = result;
      this.ref.detectChanges();
    });
    lcp.subscribe(result => {
      this.lcp = result;
      this.ref.detectChanges();
    });
    lcpFinal.subscribe(result => {
      this.lcpFinal = result;
      this.ref.detectChanges();
    });
    fid.subscribe(result => {
      this.fid = result;
      this.ref.detectChanges();
    });
    cls.subscribe(result => {
      this.cls = result;
      this.ref.detectChanges();
    });
    clsFinal.subscribe(result => {
      this.clsFinal = result;
      this.ref.detectChanges();
    });
    tbt.subscribe(result => {
      this.tbt = result;
      this.ref.detectChanges();
    });
    tbt5s.subscribe(result => {
      this.tbt5s = result;
      this.ref.detectChanges();
    });
    tbt10s.subscribe(result => {
      this.tbt10s = result;
      this.ref.detectChanges();
    });
    tbtFinal.subscribe(result => {
      this.tbtFinal = result;
      this.ref.detectChanges();
    });
    fibonacci.subscribe(result => {
      this.logFibonacci = `Perfume.js: fibonacci ${result} ms`;
      this.ref.detectChanges();
    });
    custom_fibonacci.subscribe(result => {
      this.logCustom = `🍹 HayesValley.js: Custom logging ${result} ms`;
      this.ref.detectChanges();
    });
    isLowEndDevice$.subscribe(result => {
      this.isLowEndDevice = result;
      this.ref.detectChanges();
    });
    isLowEndExperience$.subscribe(result => {
      this.isLowEndExperience = result;
      this.ref.detectChanges();
    });
    elHeroLogo.subscribe(result => {
      this.elHeroLogo = result;
      this.ref.detectChanges();
    });
    elPageTitle.subscribe(result => {
      this.elPageTitle = result;
      this.ref.detectChanges();
    });
  }

  measureFibonacci() {
    perfume.start('fibonacci');
    this.fibonacci(300);
    perfume.end('fibonacci');
  }

  customLogging() {
    perfume.start('custom_fibonacci');
    this.fibonacci(300);
    perfume.end('custom_fibonacci');
  }

  /**
   * The fibonacci methods ensures to reduce the performance of TTI and
   * make it more realistic to a bigger Single Page App
   */
  private fibonacci(num: number, memo = {}, append = true): number {
    if (memo[num]) {
      return memo[num];
    }
    if (num <= 1) {
      return 1;
    }
    if (append) {
      this.appendElSequence(num);
    }
    return (memo[num] =
      this.fibonacci(num - 1, memo, append) +
      this.fibonacci(num - 2, memo, append));
  }

  private appendElSequence(num: number): void {
    const elSequence = document.createElement('span');
    elSequence.classList.add('Fibonacci-sequence');
    elSequence.textContent = num + ' ';
    const elFibonacci = document.querySelector('.Fibonacci');
    elFibonacci.appendChild(elSequence);
    const elFibonacciNew = document.querySelector('.Fibonacci-sequence');
    if (elFibonacciNew) elFibonacciNew.remove();
  }
}
