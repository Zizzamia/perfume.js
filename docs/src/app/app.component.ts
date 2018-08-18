import { AfterViewInit, Component, ViewChild, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import Perfume from 'perfume.js';
import { DialogComponent } from './dialog/dialog.component';
// import Perfume from '../../../../perfume.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('p')
  // Component
  logCustom: string;
  logFibonacci: string;
  logOpenDialog: string;
  path: any;
  perfume: any;
  navOptions: {
    [keyof: string]: string;
  };
  navSelected: string;
  private gifIndex = 0;

  constructor(public dialog: MatDialog, private zone: NgZone) {
    // Perfume
    this.perfume = new Perfume({
      firstPaint: true,
      firstContentfulPaint: true,
      timeToInteractive: true,
      analyticsLogger: (metricName: string, duration: number) => {
        console.log('Analytics Logger', metricName, duration);
      },
      googleAnalytics: {
        enable: true,
        timingVar: 'userId',
      },
    });
    this.path = window.location.href.split('#')[0];

    // Component variables
    this.navOptions = {
      userCentric: 'user-centric-metrics',
      installing: 'installing-and-imports',
      tti: 'time-to-interactive',
      annotate: 'annotate-metrics',
      cfp: 'component-first-paint',
      log: 'custom-logging',
      ga: 'google-analytics',
      as: 'analytics-support',
      options: 'default-options',
      utilities: 'utilities',
      copyright: 'copyright-and-license',
    };
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
    this.logFibonacci = `⚡️ Perfume.js: fibonacci ${duration.toFixed(2)} ms`;
  }

  openDialog() {
    this.perfume.start('openDialog');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { gifIndex: this.gifIndex },
      width: '50%',
    });
    this.perfume.endPaint('openDialog').then(duration => {
      this.logOpenDialog = `⚡️ Perfume.js: openDialog ${duration.toFixed(
        2,
      )} ms`;
    });
    // Increment or reset index
    this.gifIndex = this.gifIndex === 4 ? 0 : this.gifIndex + 1;
  }

  customLogging() {
    this.perfume.start('fibonacci');
    this.fibonacci(800);
    const duration = this.perfume.end('fibonacci');
    this.perfume.log('Custom logging', duration);
    this.logCustom = `🍹 HayesValley.js: Custom logging ${duration.toFixed(
      2,
    )} ms`;
  }

  activeNav(selected) {
    this.navSelected = selected;
  }

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
