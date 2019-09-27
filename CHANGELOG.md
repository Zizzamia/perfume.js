# Changelog

## 3.0.0-rc.5 (2019-9-26)

* **feat:** Added initial support for Data Consumption [#85](https://github.com/Zizzamia/perfume.js/issues/85)

## 3.0.0-rc.1 (2019-9-25)

* **feat:** Added support to retrieve buffered FP/FCP events [#81](https://github.com/Zizzamia/perfume.js/issues/81)
* **feat:** Added support for first-input and removed EmulatedPerformance [#60](https://github.com/Zizzamia/perfume.js/issues/60) [#82](https://github.com/Zizzamia/perfume.js/issues/82)

### Breaking Changes

* **refactor:** Dropped support for EmulatedPerformance

## 3.0.0-beta.0 (2019-9-14)

* **feat:** Replace Map by plain old objects to support more browsers [#78](https://github.com/Zizzamia/perfume.js/pull/78)

### Breaking Changes

* **feat:** Discard queued tasks if running them as microtasks isn't supported [#77](https://github.com/Zizzamia/perfume.js/pull/77)

## 2.1.0 (2019-1-5)

### Feat

* **feat:** Added option for browser and OS infos [#45](https://github.com/Zizzamia/perfume.js/issues/45)

## 2.0.0 (2018-11-5)

### Feat

* **performance:** Now we use Idle Untile Urget strategy for logging and analytics [#55](https://github.com/Zizzamia/perfume.js/issues/55)

### Possible Breaking Changes

* **core** Removed Time to Interactive from Perfume [#54](https://github.com/Zizzamia/perfume.js/issues/54) 😬 (FID is a better metric for RUM)

## 1.2.0 (2018-10-8)

### Bug Fixes

* **fix:** Added Angular AOT support for PerfumeModule

## 1.1.0 (2018-10-3)

### Feat

* **feat:** Initial Angular decorator implementation

## 1.0.0 (2018-9-22)

### Feat

* **feat:** New Observer APIs [#46](https://github.com/Zizzamia/perfume.js/issues/46)

### Bug Fixes
* **fix:** Added TTI polyfill head script inside Perfume [#44](https://github.com/Zizzamia/perfume.js/issues/44)

## 0.9.0 (2018-8-22)

### Feat

* **feat:** Added First Input Delay metric [#33](https://github.com/Zizzamia/perfume.js/issues/33)

## 0.8.1 (2018-8-16)

### Feat

* **feat:** Send other metrics to google analytics using the sendTiming method [#39](https://github.com/Zizzamia/perfume.js/issues/39)

### Bug Fixes
* **fix:** Stop sendTiming when tab is hidden [#40](https://github.com/Zizzamia/perfume.js/issues/40)

## 0.8.0 (2018-7-11)

### Bug Fixes

* **fix:** 'PerformanceObserver is undefined' on Edge [#37](https://github.com/Zizzamia/perfume.js/pull/37)
* **fix:** All console logging is now disabled when the `config.logging` flag is set to false [#35](https://github.com/Zizzamia/perfume.js/issues/35)
* **build:** export library with the same name for all bundles [#32](https://github.com/Zizzamia/perfume.js/pull/32)

## 0.7.1 (2018-5-17)

### Feat

* **feat:** Added generic analytics platform support [#24](https://github.com/Zizzamia/perfume.js/issues/24)
* **feat:** Added warning option [#34](https://github.com/Zizzamia/perfume.js/issues/34)

## 0.7.0 (2018-5-12)

### Feat

* **feat:** timeToInteractive as promise [#23](https://github.com/Zizzamia/perfume.js/issues/23)

### Build & Style

* **style:** update tslint [#31](https://github.com/Zizzamia/perfume.js/issues/31)
* **build:** Minify umd bundle [#30](https://github.com/Zizzamia/perfume.js/issues/30)
* **build:** Do not bundle deps into main & module entries [#28](https://github.com/Zizzamia/perfume.js/issues/28)

## 0.6.6 (2018-3-25)

### Bug Fixes

* **fix:** emulated performance getFirstPaint() passes array of entries

## 0.6.5 (2018-3-12)

### Bug Fixes

* **feat:** Init FirstPaint metric

## 0.6.4 (2018-3-5)

### Bug Fixes

* **uglify:** Minify generated bundle

## 0.6.3 (2018-3-5)

### Bug Fixes

* **start/end:** Fixed support performance.measure in Safari

## 0.6.2 (2018-3-3)

### Bug Fixes

* **measure:** Fixed getMeasurementForGivenName return value

## 0.6.1 (2018-3-3)

### Bug Fixes

* **start/end:** Fixed Performance.getDurationByMetric method

## 0.6.0 (2018-3-3)

### Bug Fixes

* **test:** Increased cross-browser tests and separate the native logic from the emulated version [#24c8996](https://github.com/Zizzamia/perfume.js/commit/24c8996fa894e64e928b84ec680e2fa61df4aa99) [#22](https://github.com/Zizzamia/perfume.js/issues/22).

## 0.5.0 (2018-1-14)

### Features

* **config:** Pass config into constructor [#14](https://github.com/Zizzamia/perfume.js/issues/14)

### Bug Fixes

* **fcp:** Use PerformanceObserver for FCP [#18](https://github.com/Zizzamia/perfume.js/issues/18)

## 0.4.0 (2018-1-7)

### Features

* **tti:** Time to Interactive [#15](https://github.com/Zizzamia/perfume.js/issues/15)

## 0.3.0 (2018-1-3)

### Features

* **endPaint:** Added endPaint() method [#13](https://github.com/Zizzamia/perfume.js/issues/13)

## 0.2.6 (2018-1-2)

### Bug Fixes

* **GA:** Fixed timingValue

## 0.2.5 (2018-1-1)

### Bug Fixes

* **GA:** Fixed timingVar

## 0.2.4 (2017-12-31)

### Bug Fixes

* **GA:** Fixed window.ga type

## 0.2.3 (2017-12-31)

### Features

* **GA:** Init Google Analytics [#12](https://github.com/Zizzamia/perfume.js/issues/12)

## 0.2.2 (2017-12-29)

### Bug Fixes

* **end:** fixed end() and getDurationByMetric() methods [#9](https://github.com/Zizzamia/perfume.js/issues/9)
* **docs:** Annotate metrics in the DevTools [#10](https://github.com/Zizzamia/perfume.js/issues/10)

## 0.2.1 (2017-12-28)

### Bug Fixes

* **start:** Fixed start method; Increased tests coverage; [#8](https://github.com/Zizzamia/perfume.js/issues/8)

## 0.2.0 (2017-12-28)

### Bug Fixes

* **patch:** Setup Travis [#6](https://github.com/Zizzamia/perfume.js/issues/6)
* **lint:** Remove prettier, adjust tslint, fix linting errors [#4](https://github.com/Zizzamia/perfume.js/issues/4)
* **logging:** Improved logging [#3](https://github.com/Zizzamia/perfume.js/issues/3)
