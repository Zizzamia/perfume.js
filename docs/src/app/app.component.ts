// Angular & Third Party
import { Component } from '@angular/core';
import Perfume from 'perfume.js';
// import Perfume from '../../../src/perfume';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logCustom: string;
  logFibonacci: string;
  logTogglePopover: string;
  path: any;
  perfume: any;
  navOptions: {
    [keyof: string]: string
  };
  navSelected: string;

  constructor() {
    // Perfume
    const perfume = new Perfume();
    perfume.googleAnalytics.enable = true;
    perfume.googleAnalytics.timingVar = "userId";
    this.perfume = perfume;
    this.perfume.firstContentfulPaint();
    this.perfume.timeToInteractive();
    this.path = window.location.href.split('#')[0];

    // Component variables
    this.navOptions = {
      userCentric: "user-centric-metrics",
      installing: "installing-and-imports",
      tti: "time-to-interactive",
      annotate: "annotate-metrics",
      cfp: "component-first-paint",
      log: "custom-logging",
      ga: "google-analytics",
      copyright: "copyright-and-licenses",
    };
  }

  fibonacci(num, memo = {}) {
    if (memo[num]) {
      return memo[num];
    }
    if (num <= 1) {
      return 1;
    }
    return memo[num] = this.fibonacci(num - 1, memo) + this.fibonacci(num - 2, memo);
  }

  measureFibonacci() {
    this.perfume.start('fibonacci');
    this.fibonacci(400);
    const duration = this.perfume.end('fibonacci', true);
    this.logFibonacci = `⚡️ Perfume.js: fibonacci ${duration.toFixed(2)} ms`;
  }

  togglePopover(element) {
    this.perfume.start('togglePopover');
    $(element).popover('toggle');
    this.perfume.endPaint('togglePopover', true)
    .then((duration) => {
      this.logTogglePopover = `⚡️ Perfume.js: togglePopover ${duration.toFixed(2)} ms`;
    });
  }

  customLogging() {
    this.perfume.start('fibonacci');
    this.fibonacci(400);
    const duration = this.perfume.end('fibonacci');
    this.perfume.log('Custom logging', duration);
    this.logCustom = `⚡️ Perfume.js: Custom logging ${duration.toFixed(2)} ms`;
  }

  activeNav(selected) {
    this.navSelected = selected;
  }
}
