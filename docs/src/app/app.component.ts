import { Component } from '@angular/core';
// Test npm version
//import Perfume from 'perfume.js';

// Test local dist version
import Perfume from '../../../dist/es/perfume';

const perfume = new Perfume;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  
  constructor() { }

  ngOnInit() {
    perfume.firstPaint();
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
    perfume.start('fibonacci');
    this.fibonacci(400);
    perfume.end('fibonacci', true);
  }
}
