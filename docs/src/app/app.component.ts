import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
// import Perfume from 'perfume.js';
import Perfume from '../../../../perfume.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('p')
  public popover: NgbPopover;
  // Component
  logCustom: string;
  logFibonacci: string;
  logTogglePopover: string;
  path: any;
  perfume: any;
  navOptions: {
    [keyof: string]: string;
  };
  navSelected: string;

  constructor() {
    // Perfume
    this.perfume = new Perfume({
      firstPaint: true,
      firstContentfulPaint: true,
      timeToInteractive: true,
      analyticsLogger: (metricName, duration) => {
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
    setTimeout(() => {
      this.runFibonacci(500);
    }, 500);
  }

  runFibonacci(maxSequence: number) {
    this.fibonacci(maxSequence, {}, true);
    this.reverseFibonacciSequence(6);
    $('.Fibonacci').empty();
  }

  fibonacci(num, memo = {}, append = false) {
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

  appendElSequence(num) {
    const elSequence = $(`<span class="Fibonacci-sequence">${num} </span>`);
    elSequence.css({
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });
    $('.Fibonacci').append(elSequence);
  }

  reverseFibonacciSequence(reccurrence = 1) {
    const $elFibonacci = $('.Fibonacci');
    $elFibonacci.children().each((i, sequence) => {
      $elFibonacci.prepend(sequence);
    });
    reccurrence -= 1;
    if (reccurrence > 0) {
      this.reverseFibonacciSequence(reccurrence);
    }
  }

  measureFibonacci() {
    this.perfume.start('fibonacci');
    this.fibonacci(800);
    const duration = this.perfume.end('fibonacci');
    this.logFibonacci = `⚡️ Perfume.js: fibonacci ${duration.toFixed(2)} ms`;
  }

  togglePopover() {
    this.perfume.start('togglePopover');
    const isOpen = this.popover.isOpen();
    this.popover.close();
    if (!isOpen) {
      this.popover.open();
    }
    this.perfume.endPaint('togglePopover').then(duration => {
      this.logTogglePopover = `⚡️ Perfume.js: togglePopover ${duration.toFixed(
        2,
      )} ms`;
    });
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
}
