import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';

import { NgPerfume } from 'perfume.js/angular';
// import {
//   NgPerfume,
//   PerfumeAfterViewInit,
// } from '../../projects/perfume/src/lib/perfume.module';

import {
  navigationTiming,
  dataConsumption,
  fp,
  fcp,
  lcp,
  fid,
  fibonacci,
  custom_fibonacci,
  networkInformation,
  isLowEnd,
} from './perfume.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('p', { static: true })
  // Component
  navigationTiming = {};
  networkInformation = {};
  dataConsumption = {};
  logCustom: string;
  logFibonacci: string;
  fp: number;
  fcp: number;
  fid: number;
  lcp: number;
  path: string;
  isLowEnd: boolean;

  constructor(private ref: ChangeDetectorRef, public perfume: NgPerfume) {
    this.path = window.location.href.split('#')[0];
  }

  ngAfterViewInit() {
    navigationTiming.subscribe(result => {
      this.navigationTiming = result;
      this.ref.detectChanges();
    });
    networkInformation.subscribe(result => {
      this.networkInformation = result;
      this.ref.detectChanges();
    });
    dataConsumption.subscribe(result => {
      this.dataConsumption = result;
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
    fid.subscribe(result => {
      this.fid = result;
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
    isLowEnd.subscribe(result => {
      this.isLowEnd = result;
      this.ref.detectChanges();
    });
  }

  measureFibonacci() {
    this.perfume.start('fibonacci');
    this.fibonacci(800);
    this.perfume.end('fibonacci');
  }

  customLogging() {
    this.perfume.start('custom_fibonacci');
    this.fibonacci(800);
    this.perfume.end('custom_fibonacci');
  }

  /**
   * The fibonacci methods ensures to reduce the performance of TTI and
   * make it more realistic to a bigger Single Page App
   */
  private fibonacci(num: number, memo = {}, append: boolean = false): number {
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
    elSequence.style.color =
      '#' + Math.floor(Math.random() * 16777215).toString(16);
    const elFibonacci = document.querySelector('.Fibonacci');
    elFibonacci.appendChild(elSequence);
  }
}
