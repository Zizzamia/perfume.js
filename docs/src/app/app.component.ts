import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
  NgZone,
} from '@angular/core';

import { NgPerfume, PerfumeAfterViewInit } from 'perfume.js/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
@PerfumeAfterViewInit()
export class AppComponent implements AfterViewInit {
  @ViewChild('p')
  // Component
  logCustom: string;
  logFibonacci: string;
  firstContentfulPaint: number;
  firstInputDelay: number;
  timeToInteractive: number;
  path: string;

  constructor(
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    public perfume: NgPerfume,
  ) {
    // Perfume
    this.observeFCP();
    this.observeFID();
    this.observeTTI();
    this.path = window.location.href.split('#')[0];
  }

  ngAfterViewInit() {
    // Ensure the page to have 400ms delay for TTI
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.runFibonacci(4500);
      }, 400);
    });
  }

  measureFibonacci() {
    this.perfume.start('fibonacci');
    this.fibonacci(800);
    const duration = this.perfume.end('fibonacci');
    this.logFibonacci = `⚡️ Perfume.js: fibonacci ${duration} ms`;
  }

  customLogging() {
    this.perfume.start('fibonacci');
    this.fibonacci(800);
    const duration = this.perfume.end('fibonacci') as number;
    this.perfume.log('Custom logging', duration);
    this.logCustom = `🍹 HayesValley.js: Custom logging ${duration} ms`;
  }

  private async observeFCP() {
    this.firstContentfulPaint = await this.perfume.observeFirstContentfulPaint;
    this.ref.detectChanges();
  }

  private async observeFID() {
    this.firstInputDelay = await this.perfume.observeFirstInputDelay;
    this.ref.detectChanges();
  }

  private async observeTTI() {
    this.timeToInteractive = await this.perfume.observeTimeToInteractive;
    this.ref.detectChanges();
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

  private runFibonacci(maxSequence: number) {
    this.fibonacci(maxSequence, {}, true);
    const elFibonacci = document.querySelector('.Fibonacci');
    while (elFibonacci.firstChild) {
      elFibonacci.removeChild(elFibonacci.firstChild);
    }
  }
}
