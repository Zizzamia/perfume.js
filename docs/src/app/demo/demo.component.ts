import { Component, OnInit } from '@angular/core';
import { Perfume } from '../../../../src/perfume';

const perfume = new Perfume;

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
