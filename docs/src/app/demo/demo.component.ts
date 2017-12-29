import { Component, OnInit } from '@angular/core';
// Test npm version
//import Perfume from 'perfume.js';

// Test local dist version
import Perfume from '../../../dist/es/perfume';

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }
}
