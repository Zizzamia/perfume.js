<a href="http://www.perfumejs.com/">
  <img src="https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/perfume-logo-v5-0-0.png"
  align="left" width="200" alt="Perfume.js logo" />
</a>

# [Perfume.js v9.4.0](http://perfumejs.com)

[![Current version](https://img.shields.io/github/tag/zizzamia/perfume.js?color=3498DB&label=version)](https://www.npmjs.org/package/perfume.js) [![Test Coverage](https://api.codeclimate.com/v1/badges/f813d2f45b274d93b8c5/test_coverage)](https://codeclimate.com/github/Zizzamia/perfume.js/test_coverage) <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg"> [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![gzip size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=gzip&label=JS+gzip+size)](https://unpkg.com/perfume.js) [![brotli size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=brotli&label=JS+brotli+size)](https://unpkg.com/perfume.js)

> <b>Page Speed</b> is a feature, and to deliver it we need to understand the many factors and fundamental limitations that are at play. If we can measure it, we can improve it.

<br />
<br />
<br />
<br />

## Why Perfume.js?

Perfume is a tiny, web performance monitoring library that reports field data back to your favorite analytics tool.

- ⏰ Supports latest Performance APIs for precise metrics
- 🚀 Device data enrichment
- 🔨 Cross browser tested
- 🚿 Filters out false positive/negative results
- 🤙 Only 5.1Kb gzip
- 🏅 Web Vitals Score
- 🛰 Flexible analytics tool
- ⚡️ Waste-zero ms with [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback) strategy built-in
- Ability to track data about user actions
  <br />

## The latest in metrics & Real User Measurement

**Perfume** leverages the latest Performance APIs to collect **field data** that allows us to understand what real-world users are actually experiencing.

- [Navigation Timing](#navigation-timing)
- Navigator Interface
- [Resource Timing](#resource-timing)
- [Element Timing](#element-timing)
- Service Worker Status
- StorageManager interface
- Time to First Byte ([TTFB](https://web.dev/ttfb/#what-is-a-good-ttfb-score))
- First Contentful Paint ([FCP](https://web.dev/first-contentful-paint/))
- Largest Contentful Paint ([LCP](https://web.dev/lcp/))
- First Input Delay ([FID](https://web.dev/fid/))
- Cumulative Layout Shift ([CLS](https://web.dev/cls/))
- Interaction to Next Paint ([INP](https://web.dev/inp/))
- Total Blocking Time ([TBT](https://web.dev/tbt/))
- Navigation Total Blocking Time ([NTBT](#navigation-total-blocking-time-ntbt))

<br />
At <a href="https://www.coinbase.com/blog/performance-vitals-a-unified-scoring-system-to-guide-performance-health-and-prioritization">Coinbase</a>, we use Perfume.js to capture a high-level scoring system that is clear, trusted, and easy to understand.
<br />
<br />
Summarizing the performance health of an application into a reliable and consistent score helps increase urgency and directs company attention and resources towards addressing each performance opportunity.
<br />

## Perfume.js vs [Web Vitals](https://github.com/GoogleChrome/web-vitals)

**Perfume** leverages the [Web Vitals](https://github.com/GoogleChrome/web-vitals) library to collect all the standardized performance metrics. It explores new metrics like Navigation Total Blocking Time and dimensions like Low-End Devices, Service Worker status to understand your data better.

So don't worry, Perfume.js is a superset of Web Vitals, a bit like Typescript is a superset of Javascript.

## Installing

npm (https://www.npmjs.com/package/perfume.js):

    npm install perfume.js --save

### Importing library

You can import the generated bundle to use the whole library generated:

```javascript
import { initPerfume } from 'perfume.js';
```

Universal Module Definition:

```javascript
import { initPerfume } from 'node_modules/perfume.js/dist/perfume.umd.min.js';
```

<br />

## Quick start

Metrics like **Navigation Timing**, **Network Information**, **TTFB**, **FCP**, **FID**, **LCP**, **CLS**, **INP** and **TBT** are default reported with Perfume; All results will be reported to the `analyticsTracker` callback, and the code below is just one way for you to organize your tracking, feel free to tweak it suit your needs.

🚀 Visit [perfumejs.com](http://perfumejs.com/) for a live demo on how the metrics work. 🌕

```javascript
import { initPerfume } from 'perfume.js';

initPerfume({
  analyticsTracker: options => {
    const {
      attribution,
      metricName,
      data,
      navigatorInformation,
      rating,
      navigationType,
    } = options;
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
      case 'storageEstimate':
        myAnalyticsTool.track('storageEstimate', data);
        break;
      case 'TTFB':
        myAnalyticsTool.track('timeToFirstByte', { duration: data });
        break;
      case 'RT':
        myAnalyticsTool.track('redirectTime', { duration: data });
        break;
      case 'FCP':
        myAnalyticsTool.track('firstContentfulPaint', { duration: data });
        break;
      case 'FID':
        myAnalyticsTool.track('firstInputDelay', { duration: data });
        break;
      case 'LCP':
        myAnalyticsTool.track('largestContentfulPaint', { duration: data });
        break;
      case 'CLS':
        myAnalyticsTool.track('cumulativeLayoutShift', { value: data });
        break;
      case 'INP':
        myAnalyticsTool.track('interactionToNextPaint', { value: data });
        break;
      case 'TBT':
        myAnalyticsTool.track('totalBlockingTime', { duration: data });
        break;
      case 'elPageTitle':
        myAnalyticsTool.track('elementTimingPageTitle', { duration: data });
        break;
      case 'userJourneyStep':
        myAnalyticsTool.track('userJourneyStep', {
          duration: data,
          stepName: attribution.step_name,
          vitals_score: rating,
        });
        break;
      default:
        myAnalyticsTool.track(metricName, { duration: data });
        break;
    }
  },
});
```

In a world with widely varying device capabilities, a one-size-fits-all event doesn’t always work. Perfume adds **data enrichment** to all events so we can better understand the real world experiences:

- **deviceMemory**: the user's device memory (RAM).
- **hardwareConcurrency**: the number of logical CPU processor cores on the user's device.
- **serviceWorkerStatus**: status of the service worker between controlled, supported and unsupported.

Based on the Navigator APIs the library can help us differentiate between a low-end and a high-end device/experience:

- **isLowEndDevice**: combination of the score of RAM and CPU.
- **isLowEndExperience**: combination of the score of RAM, CPU, NetworkStatus and SaveData.

## Performance audits

Coo coo coo [cool](https://www.youtube.com/watch?v=zDcbpFimUc8), let's learn something new.

### Navigation Timing

Navigation Timing collects performance metrics for the life and timings of a network request.

Perfume helps expose some of the key metrics you might need.

<ul>
  <li><b>Redirect time</b>: Page redirects aren't totally inconsequential, but they might not be something you run into very often. Still, redirects add latency to requests, so measuring them may be worth the effort.</li>
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
// Perfume.js: navigationTiming { ... timeToFirstByte: 192.65 }
```

### First Paint ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FP** is the exact time taken for the browser to render anything as visually different from what was on the screen before navigation, e.g. a background change after a long blank white screen time.

```javascript
// Perfume.js: fp 1482.00 ms
```

### Navigation Total Blocking Time (NTBT)

This metric measures the amount of time the application may be blocked from processing code during the 2s window after a user navigates from page A to page B. The NTBT metric is the summation of the blocking time of all long tasks in the 2s window after this method is invoked.

Because this library is navigation agnostic, we have this method to mark when the navigation starts.

If this method is called before the 2s window ends; it will trigger a new NTBT measurement and interrupt the previous one.

```javascript
import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

initPerfume({
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});

// React custom history
history.listen(() => {
  // Measure NTBT at the beginning of each navigation
  perfume.markNTBT();
});

// Perfume.js: ntbt 78 ms
```

### Resource Timing

Resource Timing collects performance metrics for document-dependent resources. Stuff like style sheets, scripts, images, et cetera.
Perfume helps expose all PerformanceResourceTiming entries and groups data data consumption by Kb used.

```javascript
initPerfume({
  resourceTiming: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
// Perfume.js: dataConsumption { "css": 185.95, "fetch": 0, "img": 377.93, ... , "script": 8344.95 }
```

### Annotate metrics in the DevTools

**Performance.mark** ([User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)) is used to create an application-defined peformance entry in the browser's performance entry buffer.

```javascript
import { start, end } from 'perfume.js';

initPerfume({
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
start('fibonacci');
fibonacci(400);
end('fibonacci');
// Perfume.js: fibonacci 0.14 ms
```

![Performance Mark](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-mark.png)

### Element Timing

Track when image elements and text nodes are displayed on screen using the [emerging](https://chromestatus.com/features#elementtiming) [Element Timing API](https://wicg.github.io/element-timing/) specification by simply adding the `elementtiming` attribute with a descriptive value of your choice to HTML elements you would like to measure:

```html
<h1 elementtiming="elPageTitle" class="title">Perfume.js</h1>
<img
  elementtiming="elHeroLogo"
  alt="Perfume.js logo"
  src="https://zizzamia.github.io/perfume/assets/perfume-logo-v5-0-0.png"
/>
```

```javascript
initPerfume({
  elementTiming: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});

// Perfume.js: elPageTitle 256.00 ms
// Perfume.js: elHeroLogo 1234.00 ms
```

### User Journey Step Tracking

A Step represents a slice of time in the User Journey where the user is blocked by **system time**. System time is time the system is blocking the user. For example, the time it takes to navigate between screens or fetch critical information from the server. This should not be confused with **cognitive time**, which is the time the user spends thinking about what to do next. User Journey steps should only cover system time.

A Step is defined by an event to start the step, and another event to end the step. These events are referred to as **Marks**.

As an example, a Step could be to navigate from screen A to screen B. The appropriate way to mark a start and end to this step is by marking the start when tapping on the button on screen A that starts the navigation and marking the end when screen B comes into focus with the critical data rendered on the screen.

```typescript
// Marking the start of the step
const ScreenA = () => {
  const handleNavigation = () =>  {
    ... // Navigation logic
    // Mark when navigating to screen B
    markStep('navigate_to_screen_B');
  }

  ...

  return (
    <>
      <Button onPress={handleNavigation} />
    </>
  );
}

// Marking the end of the step
const ScreenB = () => {
  const { viewer } = fetch("http://example.com/userInfo")
                     .then((response) => response.json())
                     .then((data) => data);

  const {name} = viewer.userProperties;

  useEffect(() => {
    if (name) {
      // Mark when data is ready for screen B
      markStep('loaded_screen_B');
    }
  }, [name])

  ...
}
```

#### Defining Steps

In order for Perfume to be able to track metrics for Steps, we need to configure the steps and provide them when initializing Perfume.

Below you can find an example of how to do this.

```typescript
export const steps = {
  load_screen_A: {
    threshold: ThresholdTier.quick,
    marks: ['navigate_to_screen_A', 'loaded_screen_A'],
  },
  load_screen_B: {
    threshold: ThresholdTier.quick,
    marks: ['navigate_to_screen_B', 'loaded_screen_B'],
  },
};

initPerfume({ steps });
```

#### MarkStep

`markStep` is the function used to start and end steps in applications.

For example, if we wanted to mark the beginning of load_screen_B step above, we would add in `markStep('navigate_to_screen_B')` to our code.

#### `trackUJNavigation`

The purpose of this function is to only account for active steps that the user is working on. The feature will remove any inactive or 'stale' steps that are not currently in progress.

Stale steps can be created by navigating away from a page before it fully loads, this would cause the start mark to be triggered, but the end mark to not be called. This would affect the `active` steps being returned to `onMarkStep` as well as would create incorrect data if we returned back to the end mark much later than expected.

The `trackUJNavigation` function is to be called anytime there is a navigation change in your application. Below is an example for how this would work in a React Application:

```typescript
import { useLocation } from 'react-router-dom';

const MyComponent = () => {
  const location = useLocation()

  React.useEffect(() => {
    // runs on location, i.e. route, change
    trackUJNavigation();
  }, [location])
  ...
}

```

## Web Vitals Score

Perfume will expose for all major metrics the vitals score, those can be used to improve your [SEO and Google page rank](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html).

| Web Vitals                            |   Good | Needs Improvement |      Poor |
| ------------------------------------- | -----: | ----------------: | --------: |
| Time to First Byte (TTFB)             |  0-800 |          801-1800 | Over 1800 |
| Redirect Time (RT)                    |  0-100 |           101-200 |  Over 200 |
| First Contentful Paint (FCP)          | 0-2000 |         2001-4000 | Over 4000 |
| Largest Contentful Paint (LCP)        | 0-2500 |         2501-4000 | Over 4000 |
| First Input Delay (FID)               |  0-100 |           101-300 |  Over 300 |
| Cumulative Layout Shift (CLS)         |  0-0.1 |         0.11-0.25 | Over 0.25 |
| Interaction to Next Paint (INP)       |  0-200 |           201-500 |  Over 500 |
| Total Blocking Time (TBT)             |  0-200 |           201-600 |  Over 600 |
| Navigation Total Blocking Time (NTBT) |  0-200 |           201-600 |  Over 600 |

Step Tracking is based on various [thresholds](https://github.com/Zizzamia/perfume.js/blob/master/__tests__/stepsTestConstants.ts) defined.

Below are the thresholds available for each step:

| Label       | Vital Thresholds |
| ----------- | ---------------- |
| INSTANT     | [100, 200]       |
| QUICK       | [200, 500]       |
| MODERATE    | [500, 1000]      |
| SLOW        | [1000, 2000]     |
| UNAVOIDABLE | [2000, 5000]     |

## Perfume custom options

Default options provided to Perfume.js constructor.

```javascript
const options = {
  resourceTiming: false,
  elementTiming: false,
  analyticsTracker: options => {},
  maxMeasureTime: 30000,
  enableNavigtionTracking: true,
};
```

## Use Google Analytics

A quick way to see your page speed results on your web app is by using Google Analytics. Those GA events will show on Behavior > Site Speed > User Timings. For testing you might want to see them coming live on Realtime > Events.

Have fun ✨

```javascript
const metricNames = ['TTFB', 'RT', 'FCP', 'LCP', 'FID', 'CLS', 'TBT'];
initPerfume({
  analyticsTracker: ({ attribution, metricName, data, navigatorInformation, rating, navigationType }) => {
    if (metricNames.includes(metricName)) {
      ga('send', 'event', {
        eventCategory: 'Perfume.js',
        eventAction: metricName,
        // Google Analytics metrics must be integers, so the value is rounded
        eventValue: metricName === 'cls' ? data * 1000 : data,
        eventLabel: navigatorInformation.isLowEndExperience ? 'lowEndExperience' : 'highEndExperience',
        // Use a non-interaction event to avoid affecting bounce rate
        nonInteraction: true,
      });
    }
  })
});
```

To connect with additional analytics providers, checkout the [analytics plugin for Perfume.js](https://getanalytics.io/plugins/perfumejs/).

<br />

## Develop

- `npm run test`: Run test suite
- `npm run build`: Generate bundles and typings
- `npm run lint`: Lints code
  <br />

## Plugins

- [Perfume.js plugin for Analytics](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-perfumejs)
  <br />

## Perfume is used by

- [Conio](https://business.conio.com/)
- [Coinbase](https://www.coinbase.com)
- [Coinbase Pro](https://pro.coinbase.com)
- [Coinbase Custody](https://custody.coinbase.com)
- [Financial-Times](https://github.com/Financial-Times/n-tracking)
- [Hearst](https://www.cosmopolitan.com/)
- [Plan](https://getplan.co)
- Add your company name :)
  <br />

## Credits and Specs

Made with ☕️ by [@zizzamia](https://twitter.com/zizzamia) and
I want to thank some friends and projects for the work they did:

- [Leraging the Performance Metrics that Most Affect User Experience](https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics) for documenting this new User-centric performance metrics;ev
- [Performance Timeline Level 2](https://w3c.github.io/performance-timeline/) the definition of _PerformanceObserver_ in that specification;
- [The Contributors](https://github.com/Zizzamia/perfume.js/graphs/contributors) for their much appreciated Pull Requests and bug reports;
- **you** for the star you'll give this project 😉 and for supporting me by giving my project a try 😄

### Contributors

This project exists thanks to all the people who contribute.
<img src="https://opencollective.com/perfumejs/contributors.svg?width=890&button=false" />

### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/perfumejs#backer)]

<a href="https://opencollective.com/perfumejs#backers" target="_blank"><img src="https://opencollective.com/perfumejs/backers.svg?width=890"></a>

<br />

## Copyright and license

Code and documentation copyright 2022 [Leonardo Zizzamia](https://twitter.com/Zizzamia). Code released under the [MIT license](LICENSE). Docs released under Creative Commons.

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
