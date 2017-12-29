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
}
