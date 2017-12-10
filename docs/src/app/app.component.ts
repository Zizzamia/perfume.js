import { Component } from '@angular/core';
import { Perfume } from '../../../src/perfume';

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
