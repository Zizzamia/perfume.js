<a href="http://www.perfumejs.com/">
  <img src="https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/perfume-logo-v4-5-0.png" align="left" width="200" />
</a>

# [Perfume.js v4.7.3](http://perfumejs.com)

[![NPM version](https://badge.fury.io/js/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![Test Coverage](https://api.codeclimate.com/v1/badges/f813d2f45b274d93b8c5/test_coverage)](https://codeclimate.com/github/Zizzamia/perfume.js/test_coverage) [![JS gzip size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=gzip&label=JS+gzip+size)](https://unpkg.com/perfume.js)

> Perfume is a tiny, web performance monitoring library which reports field data like Navigation Timing, Resource Timing, First Contentful Paint (FP/FCP), Largest Contentful Paint (LCP), First Input Delay (FID) back to your favorite analytics tool.

<br />
<br />

English | [简体中文](./README-zh_CN.md)
## Why Perfume.js?

- ⏰ Supported latest Performance APIs for precise metrics
- 🔨 Cross browser tested
- 🚿 Filters out false positive/negative results
- 🤙 Only 2Kb gzip
- 🛰 Flexible analytics tool
- ⚡️ Waste-zero ms with [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback) strategy built-in
<br />

##  The latest in metrics & Real User Measurement

**Perfume** leverage the latest W3C Performance Drafts (e.g. [PerformanceObserver](https://w3c.github.io/performance-timeline/)), for measuring performance that matters! Also known as **field data**, they allow to understand what real-world users are actually experiencing.

* Navigation Timing
* Navigator Interface
* Resource Timing
* First Paint ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))
* First Contentful Paint ([FCP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))
* Largest Contentful Paint (LCP)
* First Input Delay (FID)
* Framework components lifecycle monitoring

<br />
With Perfume.js, you can collect those metrics and have a deep understanding everywhere in the world how your customers perceive web performance for your application. Use your favorite analytics tool to visualize the data between countries. Here below how it might look a sample data for <b>FCP</b> between the United States, Italy, Indonesia, and Nigeria.
<br />

![First Contentful Paint](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/first-contentful-paint-desktop.png)


## Installing

npm (https://www.npmjs.com/package/perfume.js):

    npm install perfume.js --save

### Importing library

You can import the generated bundle to use the whole library generated:

```javascript
import Perfume from 'perfume.js';
```

Universal Module Definition:

```javascript
import Perfume from 'node_modules/perfume.js/dist/perfume.umd.min.js';
```
<br />

## Quick start
Metrics like Navigation Timing, Network Information, FP, FCP, FID, and LCP are default reported with Perfume; All results will be reported to the analyticsTracker callback, and the code below is just one way on how you can organize your tracking, feel free to tweak it as you prefer.

```javascript
const perfume = new Perfume({
  analyticsTracker: (options) => {
    const { metricName, data, duration, isLowEnd } = options;
    switch (metricName) {
      case 'navigationTiming':
        if (data && data.timeToFirstByte) {
          myAnalyticsTool.track('navigationTiming', data);
        }
        break;
      case 'networkInformation':
        if (data && data.effectiveType) {
          myAnalyticsTool.track('networkInformation', data);
        }
        break;
      case 'firstPaint':
        myAnalyticsTool.track('firstPaint', { duration });
        break;
      case 'firstContentfulPaint':
        myAnalyticsTool.track('firstContentfulPaint', { duration });
        break;
      case 'firstInputDelay':
        myAnalyticsTool.track('firstInputDelay', { duration });
        break;
      case 'largestContentfulPaint':
        myAnalyticsTool.track('largestContentfulPaint', { duration });
        break;
      default:
        break;
    }
  },
  logging: false
});
```

## APIs
Coo coo coo [cool](https://www.youtube.com/watch?v=zDcbpFimUc8), let's learn something new.

### Navigation Timing
Navigation Timing collects performance metrics for the life and timings of a network request.
Perfume helps expose some of the key metrics you might need.

Navigation Timing is run by default.

<ul>
  <li><b>DNS lookup</b>: When a user requests a URL, the Domain Name System (DNS) is queried to translate a domain to an IP address.</li>
  <li><b>Header size</b>: HTTP header size</li>
  <li><b>Fetch time</b>: Cache seek plus response time</li>
  <li><b>Worker time</b>: Service worker time plus response time</li>
  <li><b>Total time</b>: Request plus response time (network only)</li>
  <li><b>Download time</b>: Response time only (download)</li>
  <li><b>Time to First Byte</b>: The amount of time it takes after the client sends an HTTP GET request to receive the first byte of the requested resource from the server.
    It is the largest web page load time component taking 40 to 60% of total web page latency.</li>
</ul>

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
// Perfume.js: NavigationTiming {{'{'}} ... timeToFirstByte: 192.65 {{'}'}}
```

### Resource Timing
Resource Timing collects performance metrics for document-dependent resources. Stuff like style sheets, scripts, images, et cetera.
Perfume helps expose all PerformanceResourceTiming entries and group data data consumption by Kb used.

```javascript
const perfume = new Perfume({
  resourceTiming: true,
  dataConsumption: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
// Perfume.js: dataConsumption { "css": 185.95, "fetch": 0, "img": 377.93, ... , "script": 8344.95 }
```

### First Paint ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FP** is the exact time the browser renders anything as visually different from what was on the screen before navigation, e.g. a background change after a long blank white screen time.

First Paint is run by default.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, duration }) => {
    myAnalyticsTool.track(metricName, duration);
  })
});
// Perfume.js: First Paint 1482.00 ms
```

### First Contentful Paint ([FCP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FCP** is the exact time the browser renders the first bit of content from the DOM, which can be anything from an important image, text, or even the small SVG at the bottom of the page.

First Contentful Paint is run by default.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, duration }) => {
    myAnalyticsTool.track(metricName, duration);
  })
});
// Perfume.js: First Contentful Paint 2029.00 ms
```

### Largest Contentful Paint (LCP)

Largest Contentful Paint (LCP) is an important, user-centric metric for measuring 
perceived load speed because it marks the point in the page load timeline when the page's main 
content has likely loaded—a fast LCP helps reassure the user that the page is useful.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, duration }) => {
    myAnalyticsTool.track(metricName, duration);
  })
});
// Perfume.js: Largest Contentful Paint 2429.00 ms
```

### First Input Delay (FID)

**FID** measures the time from when a user first interacts with your site (i.e. when they click a link, tap on a button) to the time when the browser is actually able to respond to that interaction.

First Input Delay is run by default.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, duration }) => {
    myAnalyticsTool.track(metricName, duration);
  })
});
// Perfume.js: First Input Delay 3.20 ms
```

### Annotate metrics in the DevTools

**Performance.mark** ([User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)) is used to create an application-defined peformance entry in the browser's performance entry buffer.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, duration }) => {
    myAnalyticsTool.track(metricName, duration);
  })
});
perfume.start('fibonacci');
fibonacci(400);
perfume.end('fibonacci');
// Perfume.js: fibonacci 0.14 ms
```

![Performance Mark](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-mark.png)

### Component First Paint

This metric mark the point, immediately after creating a **new component**, when the browser renders pixels to the screen.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, duration }) => {
    myAnalyticsTool.track(metricName, duration);
  })
});
perfume.start('togglePopover');
$(element).popover('toggle');
perfume.endPaint('togglePopover');
// Perfume.js: togglePopover 10.54 ms
```

![Performance](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-cfp.png)

### Custom Logging

Save the duration and print it out exactly the way you want it.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, duration }) => {
    myAnalyticsTool.track(metricName, duration);
  }),
  logPrefix: '🍹 HayesValley.js:'
});
perfume.start('fibonacci');
fibonacci(400);
const duration = perfume.end('fibonacci');
// 🍹 HayesValley.js: Custom logging 0.14 ms
```
<br />

## Frameworks

### Angular
Wth the Angular framework, we can start configuring Perfume to collect the initial performance metrics (eg. FCP, FID). Make sure to import the `PefumeModule` at first inside the `NgModule` to let the PerformanceObserver work correctly.

In a large application use the `@PerfumeAfterViewInit()` decorator to monitor the rendering performance of the most complex components. Avoid using it inside a NgFor, instead focus on components that include a collection of smaller components.

The `NgPerfume` service exposes all the methods and property of the `perfume` instance, you can annotate component lifecycles combined with APIs calls to measure how long it takes to paint the component.

```javascript
import { NgPerfume, PerfumeModule, PerfumeAfterViewInit } from 'perfume.js/angular';
import { AppComponent } from './app.component';
import { AppApi } from './app-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
@PerfumeAfterViewInit('AppComponent')
export class AppComponent implements AfterViewInit {
  data: AwesomeType;

  constructor(public perfume: NgPerfume) {
    // Start measure component time to paint
    this.perfume.start('AppComponentAfterPaint');
  }

  ngAfterViewInit() {
    this.loadAwesomeData();
  }

  loadAwesomeData = async () => {
    await AppApi.loadAmazingData();
    this.data = AppApi.loadAwesomeData();
    // End measure component time to paint
    this.perfume.endPaint('AppComponentAfterPaint');
  }
}

// Perfume.js config, supports AOT and DI
const analyticsTracker = function ({ metricName, data, duration }) {
  switch(metricName) {
    case 'navigationTiming':
      myAnalyticsTool.track(metricName, data);
      break;
    case 'resourceTiming':
      myAnalyticsTool.track(metricName, data);
      break;
    case 'dataConsumption':
      myAnalyticsTool.track(metricName, data);
      break;
    default:
      myAnalyticsTool.track(metricName, duration);
      break;
  }
})
export const PerfumeConfig = {
  dataConsumption: true,
  resourceTiming: true,
  analyticsTracker,
};

@NgModule({
  declarations: [AppComponent],
  imports: [PerfumeModule.forRoot(PerfumeConfig), BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

![Angular Performance Decorator](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/angular-performance-decorator.png)

### React
In combination with the React framework, we can start configuring Perfume to collect the initial performance metrics (eg. FCP, FID).

Use `perfume.start()` and `perfume.endPaint()` into a component lifecycle mixed with APIs calls to measure how long it takes to paint the component.

```javascript
import React from 'react';
import Perfume from 'perfume.js';

import { AppApi } from './AppApi';

const analyticsTracker = function ({ metricName, data, duration }) {
  switch(metricName) {
    case 'navigationTiming':
      myAnalyticsTool.track(metricName, data);
      break;
    case 'resourceTiming':
      myAnalyticsTool.track(metricName, data);
      break;
    case 'dataConsumption':
      myAnalyticsTool.track(metricName, data);
      break;
    default:
      myAnalyticsTool.track(metricName, duration);
      break;
  }
})

const perfume = new Perfume({
  dataConsumption: true,
  resourceTiming: true,
  analyticsTracker,
});

export default class App extends React.Component {

  constructor() {
    // Start measure component time to paint
    perfume.start('AppAfterPaint');
  }

  loadData = async () => {
    await AppApi.loadAmazingData();
    await AppApi.loadAwesomeData();
    // End measure component time to paint
    perfume.endPaint('AppAfterPaint');
  }

  render() {
    const data = this.loadData();
    return (
      <div>
        <h2>Awesome App</h2>
        <div>{data}</div>
      </div>
    );
  }
}
```
<br />

## Analytics

Configurable analytics callback to use Perfume.js with any platform.

```javascript
const perfume = new Perfume({
  analyticsTracker: (options) => {
    const {
      data,
      duration,
      metricName,
      navigatorInformation,
    } = options;
    myAnalyticsTool.track(data, duration, isLowEnd, metricName, navigatorInformation);
  })
});
```
<br />

## Customize & Utilities

### Default Options

Default options provided to Perfume.js constructor.

```javascript
const options = {
  // Metrics
  dataConsumption: false,
  resourceTiming: false,
  // Analytics
  analyticsTracker: options => {},
  // Logging
  logPrefix: "Perfume.js:"
  logging: true,
  maxMeasureTime: 15000,
};
```
<br />

## Develop

* `npm run test`: Run test suite
* `npm run build`: Generate bundles and typings
* `npm run lint`: Lints code
<br />

## Articles

* [First (Contentful) Paint with a touch of Perfume(.js)](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f)
* [Time to Interactive with RUM](https://medium.com/@zizzamia/time-to-interactive-with-rum-862ba874392c)
<br />

## Plugins

* [Perfume.js plugin for GatsbyJS](https://github.com/NoriSte/gatsby-plugin-perfume.js)
<br />

## Perfume is used by
* [Conio](https://business.conio.com/)
* [Coinbase](https://www.coinbase.com)
* [Coinbase Pro](https://pro.coinbase.com)
* [Financial-Times](https://github.com/Financial-Times/n-tracking)
* [Hearst](https://www.cosmopolitan.com/)
* [Plan](https://getplan.co)
* Add your company name :)
<br />

## Credits and Specs

Made with ☕️ by [@zizzamia](https://twitter.com/zizzamia) and
I want to thank some friends and projects for the work they did:

* [Leveraging the Performance Metrics that Most Affect User Experience](https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics) for documenting this new User-centric performance metrics;
* [Performance Timeline Level 2](https://w3c.github.io/performance-timeline/) the definition of _PerformanceObserver_ in that specification;
* [The Contributors](https://github.com/Zizzamia/perfume.js/graphs/contributors) for their much appreciated Pull Requests and bug reports;
* **you** for the star you'll give this project 😉 and for supporting me by giving my project a try 😄


### Contributors

This project exists thanks to all the people who contribute.
<img src="https://opencollective.com/perfumejs/contributors.svg?width=890&button=false" />

### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/perfumejs#backer)]

<a href="https://opencollective.com/perfumejs#backers" target="_blank"><img src="https://opencollective.com/perfumejs/backers.svg?width=890"></a>

<br />

## Copyright and license

Code and documentation copyright 2020 [Leonardo Zizzamia](https://twitter.com/Zizzamia). Code released under the [MIT license](LICENSE). Docs released under Creative Commons.

## Team

<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <a href="https://twitter.com/Zizzamia">
          <img width="100" height="100" src="https://github.com/zizzamia.png?s=150">
        </a>
        <br />
        <a href="https://twitter.com/Zizzamia">Leonardo Zizzamia</a>
      </td>
     </tr>
  </tbody>
</table>
