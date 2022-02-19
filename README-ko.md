<a href="http://www.perfumejs.com/">
  <img src="https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/perfume-logo-v5-0-0.png"
  align="left" width="200" alt="Perfume.js logo" />
</a>

# [Perfume.js v6.3.0](http://perfumejs.com)

[![Current version](https://img.shields.io/github/tag/zizzamia/perfume.js?color=3498DB&label=version)](https://www.npmjs.org/package/perfume.js) [![Test Coverage](https://api.codeclimate.com/v1/badges/f813d2f45b274d93b8c5/test_coverage)](https://codeclimate.com/github/Zizzamia/perfume.js/test_coverage) <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg"> [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![gzip size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=gzip&label=JS+gzip+size)](https://unpkg.com/perfume.js) [![brotli size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=brotli&label=JS+brotli+size)](https://unpkg.com/perfume.js)

> <b>페이지 속도</b>는 기능이며, 이를 제공하려면 작용하는 많은 요인과 근본적인 제한을 이해해야 합니다. 측정 할 수 있다면 개선 할 수 있습니다.

<br />
<br />
<br />
<br />

[English](./README.md)| [简体中文](./README-zh_CN.md) | [Italian](./README-it.md) | 한국어

## 왜 Perfume.js인가?

Perfume은 웹 퍼포먼스를 모니터링 하여, 당신이 선호 하는 분석 도구로 필드 데이터를 리포트 할 수 있는 경량 라이브러리입니다.

- ⏰ 정확한 메트릭을 위한 최신 성능 API 지원
- 🚀 장치 데이터 보강
- 🔨 크로스 브라우저 테스트
- 🚿 오탐/부정 결과(false positive/negative) 제외
- 🤙 오직 2Kb gzip
- 🏅 Web Vitals 점수
- 🛰 유연한 분석 도구
- ⚡️ 시간 낭비가 없는, [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback) 전략적인 빌트 인
  <br />

## 최신 메트릭 & 실제 사용자 측정

**Perfume**은 최신 Performance API를 활용하여 **필드 데이터**를 수집하고, 실제 사용자가 실제로 경험하는 것을 이해할 수 있습니다.

- 탐색 타이밍
- 내비게이터 인터페이스
- 리소스 타이밍
- 요소 타이밍
- 서비스 Worker 상태
- StorageManager 인터페이스
- 첫 번째 Paint ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))
- 첫 번째 콘텐츠 Paint ([FCP](https://web.dev/first-contentful-paint/))
- 콘텐츠가 가장 큰 Paint ([LCP](https://web.dev/lcp/))
- 첫 번째 입력 지연 ([FID](https://web.dev/fid/))
- 누적 레이아웃 이동 ([CLS](https://web.dev/cls/))
- 총 차단 시간 ([TBT](https://web.dev/tbt/))
- [Web Vitals Score](https://web.dev/vitals/)

<br />Perfume.js를 사용하면, 이러한 메트릭을 수집하여 전 세계 고객이 Application의 웹 성능을 어떻게 인식하는지 더 깊이 이해할 수 있습니다.
<br />
선호하는 분석 도구를 사용하여 국가별로 데이터를 시각화하십시오.
미국, 이탈리아, 인도네시아 및 나이지리아에서  www.coinbase.com에 대한 <b>FCP</b>를 비교하는 이 예시를 살펴보십시오.
<br />

![First Contentful Paint](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/first-contentful-paint-desktop.png)

## 설치하기

npm (https://www.npmjs.com/package/perfume.js):

    npm install perfume.js --save

### Importing library

생성 된 Bundle을 가져와 생성된 전체 라이브러리를 사용할 수 있습니다:

```javascript
import Perfume from 'perfume.js';
```

범용 모듈 정의하기:

```javascript
import Perfume from 'node_modules/perfume.js/dist/perfume.umd.min.js';
```

<br />

## 빠르게 시작하기

**탐색 시간(Navigation Timing)**, **네트워크 정보(Network Information)**, **FP**, **FCP**, **FID**, **LCP**, **CLS** 와 **TBT** 같은 측정 항목은 Perfume에서 기본적으로 보고됩니다; 모든 결과는 `analyticsTracker` 콜백(callback)에 보고되며, 아래 코드는 추적(Tracking)을 구성하는 한 가지 방법일 뿐입니다. 필요에 맞게 자유롭게 조정할 수 있습니다.

🚀 메트릭(Metrics) 작동 방식에 대한 라이브 데모를 보려면 [perfumejs.com](http://perfumejs.com/)를 방문해주세요.🌕

```javascript
const perfume = new Perfume({
  analyticsTracker: options => {
    const {
      metricName,
      data,
      eventProperties,
      navigatorInformation,
      vitalsScore,
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
      case 'fp':
        myAnalyticsTool.track('firstPaint', { duration: data });
        break;
      case 'fcp':
        myAnalyticsTool.track('firstContentfulPaint', { duration: data });
        break;
      case 'fid':
        myAnalyticsTool.track('firstInputDelay', { duration: data });
        break;
      case 'lcp':
        myAnalyticsTool.track('largestContentfulPaint', { duration: data });
        break;
      case 'cls':
        myAnalyticsTool.track('cumulativeLayoutShift', { value: data });
        break;
      case 'clsFinal':
        myAnalyticsTool.track('cumulativeLayoutShiftFinal', { value: data });
        break;
      case 'tbt':
        myAnalyticsTool.track('totalBlockingTime', { duration: data });
        break;
      case 'elPageTitle':
        myAnalyticsTool.track('elementTimingPageTitle', { duration: data });
        break;
      default:
        myAnalyticsTool.track(metricName, { duration: data });
        break;
    }
  },
});
```

다양한 기기 기능이 있는 요즘 세상에서, 모든 상황에 적합한 이벤트가 항상 작동하는 것은 아닙니다. Perfume은 모든 이벤트에 **데이터 보강(data enrichment)** 을 추가하여 실제 경험을 더 잘 이해할 수 있도록 합니다.

- **deviceMemory**: 사용자의 장치 메모리 (RAM).
- **hardwareConcurrency**: 사용자 장치의 논리적 CPU 프로세서의 코어 수.
- **serviceWorkerStatus**: controlled, supported와 unsupported 사이의 서비스 Worker의 상태.

Navigator API를 기반으로 하는 라이브러리는 저가형과 고급형 장치/경험을 구별하는 데 도움이 될 수 있습니다:

- **isLowEndDevice**: RAM과 CPU 점수의 조합.
- **isLowEndExperience**: RAM, CPU, NetworkStatus 및 SaveData 점수의 조합.

## 성능 감사

Coo coo coo [cool](https://www.youtube.com/watch?v=zDcbpFimUc8), 새로운 것을 배워봅시다!

탐색 타이밍은 네트워크 요청의 수명과 타이밍에 대한 성능 메트릭을 수집합니다.

Perfume은 필요한 주요 지표 중 일부를 노출하는 데 도움이 됩니다.

<ul>
  <li><b>Redirect time</b>: Page redirects aren't totally inconsequential, but they might not be something you run into very often. Still, redirects add latency to requests, so measuring them may be worth the effort.</li>
  <li><b>DNS lookup</b>: 사용자가 URL을 요청하면 도메인을 IP 주소로 변환하기 위해 DNS (Domain Name System)가 쿼리(queried)됩니다.</li>
  <li><b>Header size</b>: HTTP의 헤더 사이즈</li>
  <li><b>Fetch time</b>: 캐시 탐색 및 응답 시간</li>
  <li><b>Worker time</b>: 서비스 작업자 시간 및 응답 시간</li>
  <li><b>Total time</b>: 요청 및 응답 시간 (네트워크 만 해당)</li>
  <li><b>Download time</b>: 오직 응답 시간만 (다운로드)</li>
  <li><b>Time to First Byte</b>: 클라이언트가 HTTP GET 요청을 보낸 후 서버에서 요청 된 리소스의 첫 번째 바이트를 수신하는 데 걸리는 시간입니다. 전체 웹 페이지 대기 시간의 40 ~ 60 %를 차지하는 가장 큰 웹 페이지로드 시간 구성 요소입니다.</li>
</ul>


```javascript
// Perfume.js: navigationTiming { ... timeToFirstByte: 192.65 }
```

### First Paint ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FP**는 브라우저가 탐색하기 전에 화면에 표시된 것과 시각적으로 다른 것을 렌더링하는 데 걸린 정확한 시간입니다. (예 : 긴 빈 흰색 화면 시간 후 배경 변경하기)

```javascript
// Perfume.js: fp 1482.00 ms
```

### First Contentful Paint ([FCP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FCP**는 브라우저가 DOM에서 콘텐츠의 첫 번째 비트를 렌더링하는 데 걸리는 정확한 시간입니다. 중요한 이미지, 텍스트 또는 페이지 하단의 작은 SVG에서 가져온 콘텐츠 일 수 있습니다.

```javascript
// Perfume.js: fcp 2029.00 ms
```

### Largest Contentful Paint (LCP)

**LCP**는 페이지의 주요 콘텐츠가 로드 되었을 가능성이 있는, 페이지 로드 타임 라인의 지점 **(marks the point in the Page load timeline)** 을 표시하기 때문에 인지 된 로드 속도를 측정하는 데 중요한, 사용자 중심 측정 항목입니다. 빠른 LCP는 페이지가 유용하다는 것을 사용자에게 확신시키는 데에 도움이 됩니다.

가장 큰 콘텐츠가 있는 페인트 측정은 다음 두 지점에서 끝납니다: 첫 번째 입력 지연이 발생될 때와 페이지의 수명주기 상태가 숨김으로 변경 될 때.

```javascript
// Perfume.js: lcp 2429.00 ms
```

### First Input Delay (FID)

**FID**는 사용자가 사이트와 처음 상호 작용 한 시간 (예 : 링크를 클릭하고 버튼을 탭 할 때)부터 브라우저가 실제로 해당 상호 작용에 응답할 수 있는 시간까지의 시간을 측정합니다.

```javascript
// Perfume.js: fid 3.20 ms
```

### Cumulative Layout Shift (CLS)

**CLS**는 사용자가 예상치 못한 레이아웃 변경을 경험하는 빈도를 정량화하는 데 도움이 되므로 시각적 안정성을 측정하는 데 중요한 사용자 중심 측정 항목입니다. — 낮은 CLS는 페이지를 만족스럽게 만드는 데 도움이됩니다.

CLS측정은 두 지점에서 끝납니다. 첫 번째 입력 지연이 발생할 때와 페이지의 수명주기 상태가 숨김으로 변경 될 때.

```javascript
// Perfume.js: cls 0.13
// Perfume.js: clsFinal 0.13
```

### Total Blocking Time (TBT)

**TBT**는 페이지가 안정적으로 상호 작용하기 전에, 비대화 형 상태의 심각도를 정량화하는 데 도움이 되므로 로드 응답성을 측정하는 데 중요한 사용자 중심 측정 항목입니다.—TBT가 낮으면 페이지가 사용하기 편리한 상태임을 보장합니다.

총 차단 시간 측정은 첫 번째 입력 지연이 발생할 때, FID 후 5초, FID 후 10초, 페이지의 수명주기 상태가 숨김으로 변경되는 네 지점에서 종료됩니다.

```javascript
// Perfume.js: tbt 347.07 ms
```

### Resource Timing

리소스 타이밍은 문서 종속 리소스에 대한 성능 메트릭을 수집합니다. (스타일 시트, 스크립트, 이미지 등과 같은 것.)
Perfume은 모든 PerformanceResourceTiming 항목을 노출하고 사용 된 Kb별로 데이터 소비를 그룹화합니다.

```javascript
const perfume = new Perfume({
  resourceTiming: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
// Perfume.js: dataConsumption { "css": 185.95, "fetch": 0, "img": 377.93, ... , "script": 8344.95 }
```

### Annotate metrics in the DevTools

**Performance.mark** ([User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API))는 브라우저의 성능 항목 버퍼에 애플리케이션 정의 성능 항목을 만드는 데 사용됩니다.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
perfume.start('fibonacci');
fibonacci(400);
perfume.end('fibonacci');
// Perfume.js: fibonacci 0.14 ms
```

![Performance Mark](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-mark.png)

### Component First Paint

이 측정 항목은 **새 구성 요소**(new component)를 만든 직후 브라우저가 화면에 픽셀을 렌더링 할 때 지점을 표시합니다.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
perfume.start('togglePopover');
$(element).popover('toggle');
perfume.endPaint('togglePopover');
// Perfume.js: togglePopover 10.54 ms
```

![Performance](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-cfp.png)

### Element Timing

[emerging](https://chromestatus.com/features#elementtiming) [Element Timing API](https://wicg.github.io/element-timing/)를 사용하여 이미지 요소와 텍스트 노드가 화면에 표시되는 시기를 추적합니다. 측정하려는 HTML 요소에 선택한 설명 값과 함께`elementtiming` 속성을 추가 하기만 하면 됩니다:

```html
<h1 elementtiming="elPageTitle" class="title">Perfume.js</h1>
<img
  elementtiming="elHeroLogo"
  alt="Perfume.js logo"
  src="https://zizzamia.github.io/perfume/assets/perfume-logo-v5-0-0.png"
/>
```

```javascript
const perfume = new Perfume({
  elementTiming: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});

// Perfume.js: elPageTitle 256.00 ms
// Perfume.js: elHeroLogo 1234.00 ms
```

## Web Vitals 점수

Perfume는 모든 주요 측정 항목에 대해 vitals 점수를 노출하며, 이 점수는  [SEO and Google page rank](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html)를 개선하는 데 사용할 수 있습니다.

| Web Vitals                                |   Good | Needs Improvement |      Poor |
| ----------------------------------------- | -----: | ----------------: | --------: |
| Fist Paint (fp)                           | 0-1000 |         1001-2500 | Over 2500 |
| First Contentful Paint (fcp)              | 0-1000 |         1001-2500 | Over 2500 |
| Largest Contentful Paint (lcp)            | 0-2500 |         2501-4000 | Over 4000 |
| First Input Delay (fid)                   |  0-100 |           101-300 |  Over 300 |
| Cumulative Layout Shift (cls)             |  0-0.1 |         0.11-0.25 | Over 0.25 |
| Cumulative Layout Shift Final (clsFinal)  | 0-2500 |         2501-4000 | Over 4000 |
| Total Blocking Time (tbt)                 |  0-300 |           301-600 |  Over 600 |

## Perfume의 커스텀 옵션

Perfume.js 생성자에 제공되는 기본 옵션입니다.

```javascript
const options = {
  resourceTiming: false,
  elementTiming: false,
  analyticsTracker: options => {},
  maxMeasureTime: 30000,
};
```

## Google Analytics 사용

웹 앱에서 페이지 속도 결과를 확인하는 빠른 방법은 Google Analytics를 사용하는 것입니다. 이러한 GA 이벤트는 행동> 사이트 속도> 사용자 시간에 표시됩니다. 테스트를 위해 실시간> 이벤트에서 라이브로 제공되는 것을 볼 수 있습니다.

재미있는 시간 보내시길 바랍니다. ✨

```javascript
const metricNames = ['fp', 'fcp', 'lcp', 'fid', 'cls', 'clsFinal', 'tbt'];
new Perfume({
  analyticsTracker: ({ metricName, data, navigatorInformation }) => {
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

Additional analytics providers와 연결하려면 이 링크를 참고해주세요. [analytics plugin for Perfume.js](https://getanalytics.io/plugins/perfumejs/).

<br />

## Develop

- `npm run test`: Run test suite
- `npm run build`: Generate bundles and typings
- `npm run lint`: Lints code
  <br />

## Plugins

- [Perfume.js plugin for GatsbyJS](https://github.com/NoriSte/gatsby-plugin-perfume.js)
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

코드 및 문서 저작권 2022 [Leonardo Zizzamia](https://twitter.com/Zizzamia). [MIT license](LICENSE)에 따라 릴리스 된 코드입니다. Docs released under Creative Commons.

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
