import {
  Component,
  HostBinding,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-intro',
  template: `
    <div class="layout-content">
      <div class="box box--intro" id="/home/">
        <a href="https://github.com/zizzamia/perfume.js" target="_blank">
          <picture class="logo">
            <source srcset="{{ path }}assets/perfume-logo-v4-5-0.webp" type="image/webp" />
            <source srcset="{{ path }}assets/perfume-logo-v4-5-0.png" type="image/png" />
            <img src="{{ path }}assets/perfume-logo-v4-5-0.png" alt="Perfume.js logo" />
          </picture>
        </a>
        <h1 class="title">Perfume.js</h1>
        <p>
          <b>Page Speed</b> is a feature, and to deliver it we need to understand the many factors
          and fundamental limitations that are at play. 
          If we can measure it, we can improve it.
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
      .layout--intro .box--intro {
        margin: 0 0 40px !important;
      }
      .layout--intro .box--intro p {
        margin: 10px 0;
        font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
        font-size: 1.4em;
        font-style: italic;
        line-height: 35px;
      }
      .title {
        margin: 0;
        padding: 8px 0 0;
        font-family: 'Dancing Script', cursive;
        font-size: 3.7em;
        font-weight: 400;
        text-align: center;
        color: #f2db77;
      }
      .logo img {
        display: block;
        width: 212px;
        margin: auto;
      }
      @media (min-width: 960px) {
        .layout--intro .layout-content {
          max-width: 832px;
        }
      }
      @media (min-width: 640px) {
        .logo {
          float: left;
        }
        .title {
          text-align: left;
        }
        .layout--intro .box--intro p {
          margin: 10px 20px 10px 0px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IntroComponent implements AfterViewInit {
  @HostBinding('class.layout--intro')
  classHost = true;
  path: string;

  constructor() {
    this.path = window.location.href.split('#')[0];
  }

  ngAfterViewInit() { }
}
