<a href="http://www.perfumejs.com/">
  <img src="https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/perfume-logo-v3-0-0.png" align="left" width="200" />
</a>

# [Perfume.js v4.2.0](http://perfumejs.com)

[![NPM version](https://badge.fury.io/js/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![Test Coverage](https://api.codeclimate.com/v1/badges/f813d2f45b274d93b8c5/test_coverage)](https://codeclimate.com/github/Zizzamia/perfume.js/test_coverage) [![JS gzip size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=gzip&label=JS+gzip+size)](https://unpkg.com/perfume.js)

> 一个灵活的库，用于测量第一个dom生成的时间(<a href="https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f" target="_blank">FP/FCP</a>)、用户最早可操作时间（fid）和组件的生命周期性能。向Google Analytics或您理想的跟踪工具报告实际用户测量值。

<br />
<br />

[English](./README.md) | 简体中文
## Why Perfume.js?

- ⏰ 用最新的API获取精准的性能信息
- 🔨 跨浏览器测试
- 🚿 过滤虚假的结果
- 🔭 浏览器跟踪器内置
- 🤙 支持 async/await 语法
- 🛰 灵活的跟踪工具
- ⚡️ 内置[requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)策略，0 毫秒浪费

## 以用户为中心的性能指标

**Perfume** 利用最新的 W3C Performance 提案 (比如 [PerformanceObserver](https://w3c.github.io/performance-timeline/)), 来测试重要的性能信息! ⚡️

* 首次绘制 ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))
* 首次内容绘制 ([FCP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))
* 首次输入延迟 (FID)
* 框架、组件生命周期监控

![首次绘制和首次输入延迟](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/first-paint-and-first-input-delay.png)

#### 安装

npm (https://www.npmjs.com/package/perfume.js):

    npm install perfume.js --save-dev

### 引入

你可以直接将整个库导入。

```javascript
import Perfume from 'perfume.js';
```

也可以直接使用umd(Universal Module Definition)方式引入。

```javascript
import Perfume from 'node_modules/perfume.js/dist/perfume.umd.min.js';
```

## 开始测量

### 首次绘制 ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FP** 标记浏览器渲染任何在视觉上不同于导航前屏幕内容之内容的时间点

```javascript
const perfume = new Perfume({
  firstPaint: true
});
// Perfume.js: First Paint 1482.00 ms
```

### 首次内容绘制 ([FCP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

**FCP** 标记的是浏览器渲染来自 DOM 第一位内容的时间点，该内容可能是文本、图像、SVG 甚至 `<canvas>` 元素。

```javascript
const perfume = new Perfume({
  firstContentfulPaint: true
});
// Perfume.js: First Contentful Paint 2029.00 ms
```

### 首次输入延迟 (FID)

**FID** 测量用户首次与站点交互时（即，当他们单击链接，点击按钮或使用自定义的，由JavaScript驱动的控件）到浏览器实际能够回应这种互动的延时。
```javascript
const perfume = new Perfume({
  firstInputDelay: true
});
// Perfume.js: First Input Delay 3.20 ms
```

### 在开发者工具中标记指标

**性能标记** ([自定义时间测量API
](https://developer.mozilla.org/zh-CN/docs/Web/API/User_Timing_API)) 用于在浏览器的性能条目中创建自定义性能标记。

```javascript
perfume.start('fibonacci');
fibonacci(400);
perfume.end('fibonacci');
// Perfume.js: fibonacci 0.14 ms
```

![Performance Mark](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-mark.png)

### 组件首次渲染

当浏览器将像素渲染到屏幕时，此指标会在创建**新组件**后立即标记该点。

```javascript
perfume.start('togglePopover');
$(element).popover('toggle');
perfume.endPaint('togglePopover');
// Perfume.js: togglePopover 10.54 ms
```

![Performance](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-cfp.png)

### 自定义日志记录

保存一段时间并且按照想要的方式打印出来

```javascript
const perfume = new Perfume({
  logPrefix: '🍹 HayesValley.js:'
});
perfume.start('fibonacci');
fibonacci(400);
const duration = this.perfume.end('fibonacci');
// 🍹 HayesValley.js: Custom logging 0.14 ms
```

## 框架

### Angular
在 Angular 框架中，我们首先配置`Perfume`来收集初始化性能指标（比如 FCP,FID）,首先确保在`NgModule`中引入`PefumeModule`,使`PerformanceObserver`能正常工作。

在大型应用中使用`@PerfumeAfterViewInit()`装饰器来监听复杂组件的渲染性能，避免在` NgFor`中使用它，应该关注包含较小组件集合的组件。

`NgPerfume`服务公开了所有的`Perfume`实例的方法和属性，您可以对组件的生命周期进行标记，并结合APIs来监测组件绘制所需要的时间。



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
    // 开始测量要绘制的组件时间
    this.perfume.start('AppComponentAfterPaint');
  }

  ngAfterViewInit() {
    this.loadAwesomeData();
  }

  loadAwesomeData = async () => {
    await AppApi.loadAmazingData();
    this.data = AppApi.loadAwesomeData();
    // 结束测量部件绘制时间
    this.perfume.endPaint('AppComponentAfterPaint');
  }
}

// Perfume.js config, supports AOT and DI
export const PerfumeConfig = {
  firstContentfulPaint: true,
  firstInputDelay: true,
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
结合React 框架，我们可以开始配置`Perfume`来收集初始化性能指标（比如 FCP,FID）。

将`perfume.start()` 和 `perfume.endPaint()` API用于组件的生命周期，已测量绘制组件所需要的时间。


```javascript
import React from 'react';
import Perfume from 'perfume.js';

import { AppApi } from './AppApi';

const perfume = new Perfume({
  firstContentfulPaint: true,
  firstInputDelay: true
});

export default class App extends React.Component {

  constructor() {
    // 开始测量要绘制的组件时间
    perfume.start('AppAfterPaint');
  }

  loadData = async () => {
    await AppApi.loadAmazingData();
    await AppApi.loadAwesomeData();
    // 结束测量部件绘制时间
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

## 分析

在`Perfume.js`配置回调以支持任意平台

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, data, duration, browser }) => {
    myAnalyticsTool.track(metricName, duration, browser.name, browser.os);
  })
});
```

## 自定义 & 工具集

### 默认选项

在构造函数中提供给Perfume.js默认选项。

```javascript
const options = {
  // Metrics
  firstContentfulPaint: false,
  firstPaint: false,
  firstInputDelay: false,
  dataConsumption: false,
  navigationTiming: false,
  // Analytics
  analyticsTracker: options => {},
  browserTracker: false,
  // Logging
  logPrefix: 'Perfume.js:',
  logging: true,
  maxMeasureTime: 15000,
  warning: false,
  debugging: false,
};
```

#### 工具集

Perfume.js 公开了一些方法和属性，这些方法和属性可能对扩展这个库的人有用。

```javascript
const perfume = new Perfume({
  firstContentfulPaint: true,
  firstInputDelay: true,
});

// Values
perfume.firstPaintDuration;
perfume.firstContentfulPaintDuration;
perfume.firstInputDelayDuration;

// Aync Values
const durationFCP = await perfume.observeFirstContentfulPaint;
const durationFID = await perfume.observeFirstInputDelay;

// 将自定义用户时间标识发送到Google Analytics
perfume.sendTiming(metricName, durationFCP);
```

## 开发

* `npm start`: Run `npm run build` in watch mode
* `npm run test`: Run test suite
* `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
* `npm run build`: Generate bundles and typings
* `npm run lint`: Lints code

## 文章

* [First (Contentful) Paint with a touch of Perfume(.js)](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f)
* [Time to Interactive with RUM](https://medium.com/@zizzamia/time-to-interactive-with-rum-862ba874392c)

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


## Copyright and license

Code and documentation copyright 2019 [Leonardo Zizzamia](https://twitter.com/Zizzamia). Code released under the [MIT license](LICENSE). Docs released under Creative Commons.

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
