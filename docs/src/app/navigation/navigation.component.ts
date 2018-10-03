import {
  Component,
  HostBinding,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';

// import { PerfumeAfterViewInit } from '../../../../angular/';
import { PerfumeAfterViewInit } from 'perfume.js/angular';

@Component({
  selector: 'app-navigation',
  template: `
    <div class="layout-nav-links">
      <a href="{{ path }}#/home/"
      [class.active]="navSelected === navOptions.home"
      (click)="activeNav(navOptions.home)">Home</a>
      <a href="{{ path }}#/user-centric-metrics/"
      [class.active]="navSelected === navOptions.userCentric"
      (click)="activeNav(navOptions.userCentric)">User-centric metrics</a>
      <a href="{{ path }}#/installing-and-imports/"
      [class.active]="navSelected === navOptions.installing"
      (click)="activeNav(navOptions.installing)">Installing and Imports</a>
      <a href="{{ path }}#/first-paint/"
      [class.active]="navSelected === navOptions.fp"
      (click)="activeNav(navOptions.fp)">First Paint</a>
      <a href="{{ path }}#/first-contentful-paint/"
      [class.active]="navSelected === navOptions.fcp"
      (click)="activeNav(navOptions.fcp)">First Contentful Paint</a>
      <a href="{{ path }}#/first-input-delay/"
      [class.active]="navSelected === navOptions.fid"
      (click)="activeNav(navOptions.fid)">First Input Delay</a>
      <a href="{{ path }}#/time-to-interactive/"
      [class.active]="navSelected === navOptions.tti"
      (click)="activeNav(navOptions.tti)">Time to Interactive</a>
      <a href="{{ path }}#/annotate-metrics/"
      [class.active]="navSelected === navOptions.annotate"
      (click)="activeNav(navOptions.annotate)">Annotate metrics</a>
      <a href="{{ path }}#/component-first-paint/"
      [class.active]="navSelected === navOptions.cfp"
      (click)="activeNav(navOptions.cfp)">Component First Paint</a>
      <a href="{{ path }}#/custom-logging/"
      [class.active]="navSelected === navOptions.log"
      (click)="activeNav(navOptions.log)">Custom Logging</a>
      <a href="{{ path }}#/google-analytics/"
      [class.active]="navSelected === navOptions.ga"
      (click)="activeNav(navOptions.ga)">Google Analytics</a>
      <a href="{{ path }}#/analytics-support/"
      [class.active]="navSelected === navOptions.as"
      (click)="activeNav(navOptions.as)">Analytics Support</a>
      <a href="{{ path }}#/default-options/"
      [class.active]="navSelected === navOptions.options"
      (click)="activeNav(navOptions.options)">Default Options</a>
      <a href="{{ path }}#/default-options/"
      [class.active]="navSelected === navOptions.utilities"
      (click)="activeNav(navOptions.utilities)">Utilities</a>
      <a href="{{ path }}#/copyright-and-license/"
      [class.active]="navSelected === navOptions.copyright"
      (click)="activeNav(navOptions.copyright)">Copyright and licenses</a>
    </div>
  `,
  styles: [
    `
      .layout-nav {
        display: none;
        padding: 0 0 0 20px;
        font-size: 1em;
        color: #222;
      }
      .layout-nav a {
        display: block;
        padding: 5px 10px;
        border-left: 2px solid transparent;
        line-height: 20px;
        text-decoration: none;
      }
      .layout-nav a:hover,
      .layout-nav a.active {
        background: rgba(246, 225, 113, 0.3);
        border-left-color: rgba(227, 187, 180, 0.8);
      }
      @media (min-width: 960px) {
        .layout-nav {
          flex-shrink: 0;
          display: block;
          position: sticky;
          top: 10px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
@PerfumeAfterViewInit()
export class NavigationComponent implements AfterViewInit {
  @HostBinding('class.layout-nav')
  classHost = true;
  path: string;
  navOptions: {
    [keyof: string]: string;
  };
  navSelected: string;

  constructor() {
    this.path = window.location.href.split('#')[0];
    this.navOptions = {
      userCentric: 'user-centric-metrics',
      installing: 'installing-and-imports',
      fp: 'first-paint',
      fcp: 'first-contentful-paint',
      fid: 'first-input-delay',
      tti: 'time-to-interactive',
      cfp: 'component-first-paint',
      annotate: 'annotate-metrics',
      log: 'custom-logging',
      ga: 'google-analytics',
      as: 'analytics-support',
      options: 'default-options',
      utilities: 'utilities',
      copyright: 'copyright-and-license',
    };
  }

  ngAfterViewInit() {}

  activeNav(selected) {
    this.navSelected = selected;
  }
}
