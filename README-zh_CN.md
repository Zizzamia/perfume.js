<a href="http://www.perfumejs.com/">
  <img src="https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/perfume-logo-v5-0-0.png"
  align="left" width="200" alt="Perfume.js logo" />
</a>

# [Perfume.js v6.4.0](http://perfumejs.com)

[![Current version](https://img.shields.io/github/tag/zizzamia/perfume.js?color=3498DB&label=version)](https://www.npmjs.org/package/perfume.js) [![Test Coverage](https://api.codeclimate.com/v1/badges/f813d2f45b274d93b8c5/test_coverage)](https://codeclimate.com/github/Zizzamia/perfume.js/test_coverage) <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg"> [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![gzip size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=gzip&label=JS+gzip+size)](https://unpkg.com/perfume.js) [![brotli size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=brotli&label=JS+brotli+size)](https://unpkg.com/perfume.js)

> 提升<b>页面速度</b>需要了解许多因素和基本限制。如果我们可以衡量它，我们就可以改进它。

<br />
<br />
<br />
<br />

[English](./README.md) | 简体中文 | [Italian](./README-it.md) | [한국어](./README-ko.md)

## Why Perfume.js?

Perfume 是一个微小的网络性能监控库，可以将数据报告给你最喜欢的分析工具。

- ⏰ 支持最新的 Performance APIs 以实现精确的指标
- 🚀 设备数据丰富
- 🔨 跨浏览器测试
- 🚿 过滤虚假的结果
- 🤙 仅 2Kb gzip
- 🏅 Web Vitals Score
- 🛰 灵活的分析工具
- ⚡️ 内置 [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback) 策略，不浪费一毫秒。
  <br />

## 最新指标和真实用户评估

**Perfume** 利用最新的 Performance API 收集**现场数据**，使我们能够了解现实世界中的用户实际遇到的情况。

- 导航时间
- 导航器界面
- 资源加载计时
- 元素加载计时
- Service Worker 状态
- StorageManager 界面
- 首次绘制 ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))
- 首次内容绘制 ([FCP](https://web.dev/first-contentful-paint/))
- 最大内容绘制 ([LCP](https://web.dev/lcp/))
- 首次输入延迟 ([FID](https://web.dev/fid/))
- 累计布局偏移 ([CLS](https://web.dev/cls/))
- 总阻塞时间 ([TBT](https://web.dev/tbt/))
- [Web Vitals Score](https://web.dev/vitals/)

<br />
使用 Perfume.js，您可以收集这些指标，以更深​​入地了解世界各地的客户如何看待您应用程序的 Web 性能。
<br />
使用您喜欢的分析工具可视化各个国家/地区的数据。
让我们看一下这个示例，比较美国，意大利，印度尼西亚和尼日利亚的www.coinbase.com的 <b>FCP</b>。
<br />

![First Contentful Paint](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/first-contentful-paint-desktop.png)

## 安装

npm (https://www.npmjs.com/package/perfume.js)：

    npm install perfume.js --save

### 导入库

你可以导入生成的 bundle 来使用生成的整个库:

```javascript
import Perfume from 'perfume.js';
```

通用模块定义 (UMD)：

```javascript
import Perfume from 'node_modules/perfume.js/dist/perfume.umd.min.js';
```

<br />

## 快速入门

像 **Navigation Timing**, **Network Information**, **FP**, **FCP**, **FID**, **LCP**, **CLS** 和 **TBT** 这样的指标都是 Perfume 默认报告的；所有的结果都会被报告给 `analyticsTracker` 回调，下面的代码只是你组织跟踪的一种方式，可以根据自己的需要随意调整。

🚀 访问 [perfumejs.com](http://perfumejs.com/) 观看有关指标工作原理的现场演示。🌕

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

在设备功能千差万别的世界中，“一刀切” 的活动并非总能奏效。Perfume 为所有事件增加了**数据丰富性**，因此我们可以更好地了解现实世界的体验：

- **deviceMemory**: 用户的设备内存 (RAM)。
- **hardwareConcurrency**: 用户设备上逻辑CPU处理器内核的数量。
- **serviceWorkerStatus**: service worker 的状态，介于受控，受支持和不受支持之间。

该库基于 Navigator API，可以帮助我们区分低端和高端设备/体验：

- **isLowEndDevice**: RAM和CPU得分的组合。
- **isLowEndExperience**: RAM，CPU，NetworkStatus 和 SaveData 得分的组合。

## Performance audits

Coo coo coo [cool](https://www.youtube.com/watch?v=zDcbpFimUc8), 让我们学习一些新东西。

### Navigation Timing

Navigation Timing 收集网络请求的生命周期和计时的性能指标。

Perfume 整理公开了您可能需要的一些关键指标。

<ul>
  <li><b>Redirect time</b>: Page redirects aren't totally inconsequential, but they might not be something you run into very often. Still, redirects add latency to requests, so measuring them may be worth the effort.</li>
  <li><b>DNS lookup</b>: 当用户请求URL时，将查询域名系统（DNS）以将域转换为IP地址。</li>
  <li><b>Header size</b>: HTTP header 大小</li>
  <li><b>Fetch time</b>: 缓存查找加响应时间</li>
  <li><b>Worker time</b>: Service worker 时间加上响应时间</li>
  <li><b>Total time</b>: 请求加响应时间 (仅网络)</li>
  <li><b>Download time</b>: 仅响应时间 (下载)</li>
  <li><b>Time to First Byte</b>: 客户端发送HTTP GET请求后，从服务器接收请求资源的第一个字节所需的时间。
  它是最大的网页加载时间组成部分，占网页总延迟的 40% 到 60%。</li>
</ul>

```javascript
// Perfume.js: navigationTiming { ... timeToFirstByte: 192.65 }
```

### 首次绘制 ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FP** 是指浏览器将任何事物渲染成与导航前的屏幕上的视觉效果不同的确切时间，例如，在长时间的白屏空白后，背景发生变化。

```javascript
// Perfume.js: fp 1482.00 ms
```

### 首次内容绘制 ([FCP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FCP** 是指浏览器从 DOM 中渲染第一个内容所需的确切时间，这个时间可以是任何重要的图片、文本，甚至是页面底部的小 SVG。

```javascript
// Perfume.js: fcp 2029.00 ms
```

### 最大内容绘制 (LCP)

**LCP** 是一个重要的、以用户为中心的衡量标准，用于衡量感知加载速度，因为它标记了页面加载时间轴中页面的主要内容可能加载的时间点 -- 快速的 LCP 有助于向用户保证页面是有用的。

我们在两个点上结束了最大内容绘制：当第一次输入延迟发生时和当页面的生命周期状态改变为隐藏时。

```javascript
// Perfume.js: lcp 2429.00 ms
```

### 首次输入延迟 (FID)

**FID** 衡量的是从用户首次与您的网站进行交互（即当他们单击链接，点击按钮）到浏览器实际上能够响应该交互之间的时间。

```javascript
// Perfume.js: fid 3.20 ms
```

### 累计布局偏移 (CLS)

**CLS** 是衡量视觉稳定性的一个重要的、以用户为中心的指标，因为它有助于量化用户经历意外布局变化的频率 -- 低 CLS 有助于确保页面令人愉悦。

我们在两个点上结束累计布局偏移测量：当第一次输入延迟发生时和当页面的生命周期状态改变为隐藏时。

```javascript
// Perfume.js: cls 0.13
// Perfume.js: clsFinal 0.13
```

### 总阻塞时间 (TBT)

**TBT** 是一个重要的、以用户为中心的指标，用于衡量加载响应性，因为它有助于量化一个页面在成为可靠的交互性之前的非交互性的严重程度 -- 低 TBT 有助于确保页面的可用性。

我们在四个点结束总阻塞时间的测量：第一次输入延迟发生时、FID 后5秒、FID 后10秒和页面的生命周期状态变为隐藏时。

```javascript
// Perfume.js: tbt 347.07 ms
```

### 资源计时

Resource Timing收集文档相关资源的性能指标。诸如 style sheets, scripts, images 等。
Perfume 帮助暴露所有 PerformanceResourceTiming 条目，并按 Kb 使用量对数据数据消耗进行分组。

```javascript
const perfume = new Perfume({
  resourceTiming: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
// Perfume.js: dataConsumption { "css": 185.95, "fetch": 0, "img": 377.93, ... , "script": 8344.95 }
```

### 在 DevTools 中注释指标

**Performance.mark** ([User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)) 用于在浏览器的性能条目缓冲区中创建一个应用程序定义的性能条目。

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

### 组件首次绘制

这个度量标志着创建新组件并且浏览器将像素渲染到屏幕上的耗时。

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

### 元素计时

通过使用新兴的 [Element Timing API](https://wicg.github.io/element-timing/) 规范来跟踪图像元素和文本节点在屏幕上显示的时间，只需简单地添加 `elementtiming` 属性，并在您想要测量的HTML元素上添加一个您选择的描述性值：

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

## Web Vitals Score

Perfume 会暴露所有主要指标的生命体征得分，这些可以用来提高你的 [SEO and Google page rank](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html)。

| Web Vitals                                |   Good | Needs Improvement |      Poor |
| ----------------------------------------- | -----: | ----------------: | --------: |
| Fist Paint (fp)                           | 0-1000 |         1001-2500 | Over 2500 |
| First Contentful Paint (fcp)              | 0-1000 |         1001-2500 | Over 2500 |
| Largest Contentful Paint (lcp)            | 0-2500 |         2501-4000 | Over 4000 |
| First Input Delay (fid)                   |  0-100 |           101-300 |  Over 300 |
| Cumulative Layout Shift (cls)             |  0-0.1 |         0.11-0.25 | Over 0.25 |
| Cumulative Layout Shift Final (clsFinal)  | 0-2500 |         2501-4000 | Over 4000 |
| Total Blocking Time (tbt)                 |  0-300 |           301-600 |  Over 600 |

## Perfume 自定义选项

提供给 Perfume.js 构造函数的默认选项。

```javascript
const options = {
  resourceTiming: false,
  elementTiming: false,
  analyticsTracker: options => {},
  maxMeasureTime: 30000,
};
```

## 使用 Google Analytics

在你的 Web 应用上查看页面速度结果的一个快速方法是使用 Google Analytics。这些 GA 事件将显示在 Behavior > Site Speed > User Timings 上。对于测试，您可能希望在 Realtime > Events 上实时看到它们。

Have fun ✨

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

要连接更多的分析提供者，请查看 [analytics plugin for Perfume.js](https://getanalytics.io/plugins/perfumejs/).

<br />

## 开发

- `npm run test`: Run test suite
- `npm run build`: Generate bundles and typings
- `npm run lint`: Lints code
  <br />

## 插件

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
