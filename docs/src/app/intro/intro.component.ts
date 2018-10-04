import {
  Component,
  HostBinding,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';

// import { PerfumeAfterViewInit } from '../../../../angular/';
import { PerfumeAfterViewInit } from 'perfume.js/angular';

@Component({
  selector: 'app-intro',
  template: `
    <div class="layout-content">
      <div class="box box--intro" id="/home/">
        <a href="https://github.com/zizzamia/perfume.js" target="_blank">
          <picture class="logo">
            <source srcset="{{ path }}assets/perfume-logo-v1-1-0.webp" type="image/webp" />
            <source srcset="{{ path }}assets/perfume-logo-v1-1-0.png" type="image/png" />
            <img src="{{ path }}assets/perfume-logo-v1-1-0.png" alt="Perfume.js logo" />
          </picture>
        </a>
        <h1 class="title">Perfume.js</h1>
        <p>
          JavaScript library that measures <b>First (Contentful) Paint</b>
          (<a href="https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f"
          target="_blank">FP/FCP</a>), <br />
          <b>Time to Interactive</b>
          (<a href="https://medium.com/@zizzamia/time-to-interactive-with-rum-862ba874392c" target="_blank">TTI</a>) 
          and <b>First Input Delay</b> (FID).<br />
          Annotates components’ performance for <b>Vanilla</b> and <b>Angular</b> applications, into the DevTools timeline.
          Reports all the results to <b>Google Analytics</b> or your favorite tracking tool.
        </p>
        <a class="github-button" href="https://github.com/zizzamia/perfume.js"
        data-size="large" data-show-count="true"
        aria-label="Star zizzamia/perfume.js on GitHub">Star</a>
        <a href="https://twitter.com/zizzamia?ref_src=twsrc%5Etfw"
        class="twitter-follow-button" data-size="large"
        data-show-count="true">Follow @zizzamia</a>
      </div>
    </div>
  `,
  styles: [
    `
      @font-face {
        font-family: 'Dancing Script';
        font-style: normal;
        font-weight: 400;
        src: url('../../assets/fonts/dancing.woff2') format('woff2'),
          url('../../assets/fonts/dancing.woff') format('woff'),
          url('../../assets/fonts/dancing.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 400;
        src: url('../assets/fonts/SourceSansPro-Regular.woff2') format('woff2'),
          url('../assets/fonts/SourceSansPro-Regular.woff') format('woff'),
          url('../assets/fonts/SourceSansPro-Regular.ttf') format('truetype');
      }
      .layout--intro .box--intro {
        margin: 0 0 40px !important;
      }
      .layout--intro .box--intro p {
        margin: 10px 0;
        font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
        font-size: 1.2em;
        line-height: 34px;
      }
      .title {
        margin: 0;
        padding: 9px 0 0;
        font-family: 'Dancing Script', cursive;
        font-size: 5em;
        font-weight: 400;
        text-align: center;
        color: #f2db77;
      }
      .logo img {
        display: block;
        width: 262px;
        margin: auto;
      }
      @media (min-width: 960px) {
        .layout--intro .layout-content {
          max-width: 800px;
        }
      }
      @media (min-width: 640px) {
        .logo {
          float: left;
        }
        .title {
          text-align: left;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
@PerfumeAfterViewInit()
export class IntroComponent implements AfterViewInit {
  @HostBinding('class.layout--intro')
  classHost = true;
  path: string;

  constructor() {
    this.path = window.location.href.split('#')[0];
  }

  ngAfterViewInit() {}
}
