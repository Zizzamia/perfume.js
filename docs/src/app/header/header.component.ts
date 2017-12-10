import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	title: string;

  constructor() { 
  }

  ngOnInit() {
  	this.title = 'Perfume.js';
  }
}
