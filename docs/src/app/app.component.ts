// Angular & Third Party
import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
// import Perfume from 'perfume.js';
import Perfume from '../../../src/perfume';

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
  element: ElementRef;

  constructor(ElementRef: ElementRef, private ref: ChangeDetectorRef) {
    this.element = ElementRef;

    // Perfume
    this.perfume = new Perfume({
      firstContentfulPaint: true,
      googleAnalytics: {
        enable: true,
        timingVar: "userId"
      },
      timeToInteractive: true,
      timeToInteractiveCb: () => {
        this.ref.detectChanges();
      },
    });
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
      options: "default-options",
      copyright: "copyright-and-license",
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
    return memo[num] = this.fibonacci(num - 1, memo, append) + this.fibonacci(num - 2, memo, append);
  }

  appendElSequence(num) {
    const elSequence = $(`<span class="Fibonacci-sequence">${num} </span>`);
    elSequence.css({
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    });
    elSequence.on('click', () => {
      console.log('Lol');
    });
    $('.Fibonacci').append(elSequence);
  }

  reverseFibonacciSequence(reccurrence = 1) {
    const $elFibonacci = $('.Fibonacci');
    $elFibonacci.children().each(function(i,sequence) {
      $elFibonacci.prepend(sequence)
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

  togglePopover(element) {
    this.perfume.start('togglePopover');
    $(element).popover('toggle');
    this.perfume.endPaint('togglePopover')
    .then((duration) => {
      this.logTogglePopover = `⚡️ Perfume.js: togglePopover ${duration.toFixed(2)} ms`;
    });
  }

  customLogging() {
    this.perfume.start('fibonacci');
    this.fibonacci(800);
    const duration = this.perfume.end('fibonacci');
    this.perfume.log('Custom logging', duration);
    this.logCustom = `🍻 Beerjs: Custom logging ${duration.toFixed(2)} ms`;
  }

  activeNav(selected) {
    this.navSelected = selected;
  }
}
