# Changelog

## 7.0.0 (2022-2-21)

* **feat:** changed both TBT and NTBT Vitals to be less than 200 milliseconds for Good Score.

## 6.4.0 (2022-2-21)

* **feat:** added `perfume.markNTBT` as a way to mark the new Navigation Total Blocking Time metric.

## 6.3.0 (2021-10-20)

* **feat:** added `redirectTime` to `navigationTiming`, this will help better understand performance regression related to redirect requests.

## 6.2.0 (2021-5-5)

* **fix:** terser properties updated.

## 6.1.0 (2021-5-5)

* **feat:** improved CLS and all metrics accuracy to four digits after the decimal point.

## 6.0.0 (2021-5-5)

* **feat:** introduced **Time to First Byte** as his own top-level metric.
* **feat:** simplified **Total Blocking Time** metrics into one solo version that focuses on waiting 10s after **First Input Delay**.
* **feat:** increased the `maxMeasureTime` default value from 15s to 30s, this will allow better data for metrics like LCP which tend to have much higher values. 

### Breaking Changes
The two key breaking changes in v6 are focus around the simplification of First Input Delay and Total Blocking Time, and the increase of the default value for `maxMeasureTime`.

## 5.3.0 (2020-9-2)

* **feat:** added the raw `performanceEntry` object in the reporting for FID and FID Vitals. This will help developer to do more custom analysis based on the FID target.

## 5.2.3 (2020-8-28)

* **fix:** miss PerformanceObserver in rollup config

## 5.2.2 (2020-8-27)

* **fix:** added processingStart in minified file

## 5.2.1 (2020-8-27)

* **fix:** added fidVitals to vitalsScore

## 5.2.0 (2020-8-26)

* **fix:** conditionally make calls to PerformanceObserver.takeRecords which does not exist in Safari [#138](https://github.com/Zizzamia/perfume.js/pull/138)
* **fix:** report CLS when value is 0
* **feat:** prepare new FID iteration for v6
* **chore:** Italian README [#137](https://github.com/Zizzamia/perfume.js/pull/137)

## 5.1.1 (2020-8-12)

* **fix:** added storage.estimate feature detection [#136](https://github.com/Zizzamia/perfume.js/issues/136)

## 5.1.0 (2020-6-2)

* **feat:** added web vitals score to metrics [#126](https://github.com/Zizzamia/perfume.js/issues/126)
* **feat:** added element timing support [#124](https://github.com/Zizzamia/perfume.js/pull/124)

## 5.0.2 (2020-5-9)

* **fix:** measuring with `perfume.end()` now returns the **duration** of the annotation instead of an object

## 5.0.0 (2020-5-9)

* **feat:** simplified the `analyticsTracker` by having all duration value inside the `data` property
* **feat:** enabled `PerformanceObserver` for all browser, before was only for Chrome
* **feat:** added Total Blocking Time [#112](https://github.com/Zizzamia/perfume.js/issues/112)
* **feat:** added Total Blocking Time Final for when the page's lifecycle state changes to hidden
* **feat:** added secondary log for LCP and CLS called LCP Final & CLS Final for when the page's lifecycle state changes to hidden
* **feat:** added `storageEstimateQuota` and `storageEstimateUsage` to the **navigatorInfo** results
* **fix:** added feature detection for `clearMarks`
* **fix:** solved issue with `storageEstimate` and created his own event
* **refactor:** reduced library size to 2Kb gzipped

### Breaking Changes

Until now, we allowed only Chrome to run the PerformanceObserver interface because of possible cross-browser issues. One in particular related to Firefox 58: https://bugzilla.mozilla.org/show_bug.cgi?id=1403027. Starting from Perfume.js v5, we are going to remove this limitation.

Having both `duration` and 	`data` inside the `analyticsTracker`, it started causing some confusion. Starting from v5, we will keep only `data` and have any information from `duration` contained inside `data`. Please make sure to change the code inside your `analyticsTracker`.

More changes:
- Removed the development logging options, in favor of focusing more on the `analyticsTracker` method.
- Removed warning logs for `start()` and `end()` methods, because the code already handles those edge cases.
- Renamed most of metric names, please read [README Quickstart](https://github.com/Zizzamia/perfume.js#quick-start) to see the latest name version we have. We made most of metric with short names, to allow the library to be even smaller.
- Simplified `EstimateStorage` values, to help reduce library size.

## 5.0.0-rc.19 (2020-5-6)

* **fix:** added extra check to avoid multiple `disconnectPerfObserversHidden` calls

## 5.0.0-rc.18 (2020-5-6)

* **fix:** added extra check in case `observer` object is not present

## 5.0.0-rc.17 (2020-4-30)

* **feat:** added Total Blocking Time Final metrics
* **refactor:** reduced library kb part XI

## 5.0.0-rc.16 (2020-4-30)

* **refactor:** reduced library kb part X
* **fix:** added extra check to remove observer reference

## 5.0.0-rc.15 (2020-4-26)

* **fix:** added back analyticsTracker into the configs

## 5.0.0-rc.14 (2020-4-26)

* **refactor:** reduced library kb part IX

### Breaking Changes

Removed the development logging options, in favor of focusing more on the `analyticsTracker` method.

## 5.0.0-rc.13 (2020-4-26)

* **refactor:** reduced library kb part VIII

### Breaking Changes

Removed warning logs for start() and end() methods, because the code already handles those edge cases.

## 5.0.0-rc.12 (2020-4-26)

* **refactor:** reduced library kb part VII

### Breaking Changes

Renamed most of metric names, please read README Quickstart to see the latest name version we have.
We made most of metric with short names, to allow the library to be even smaller.

## 5.0.0-rc.11 (2020-4-26)

* **refactor:** reduced library kb part VI

## 5.0.0-rc.10 (2020-4-26)

* **refactor:** reduced library kb part V & simplified estimateStorage metric result

### Breaking Changes

Simplified EstimateStorage values, to help reduce library size.

## 5.0.0-rc.9 (2020-4-25)

* **refactor:** reduced library kb part IV

## 5.0.0-rc.8 (2020-4-24)

* **refactor:** reduced library kb part III

## 5.0.0-rc.7 (2020-4-24)

* **refactor:** reduced library kb part II

## 5.0.0-rc.6 (2020-4-21)

* **refactor:** reduced library kb part I

## 5.0.0-rc.5 (2020-4-19)

* **feat:** added secondary log for LCP/CLS when the page's lifecycle state changes to hidden

## 5.0.0-rc.4 (2020-4-19)

* **fix:** solved issue with `storageEstimate` and created his own event
* **fix:** removed extra calls for `totalBlockingTime`

## 5.0.0-rc.3 (2020-4-18)

* **feat:** added Total Blocking Time [#112](https://github.com/Zizzamia/perfume.js/issues/112)

## 5.0.0-rc.2 (2020-4-16)

* **feat:** added `storageEstimateQuota` and `storageEstimateUsage` to the **navigatorInfo** results
* **fix:** added feature detection for `clearMarks`

## 5.0.0-rc.1 (2020-4-14)

* **feat:** enabled `PerformanceObserver` for all browser
* **feat:** simplified the `analyticsTracker` by having all duration value inside the `data` property

### Breaking Changes

Until now, we allowed only Chrome to run the PerformanceObserver interface because of possible cross-browser issues. One in particular related to Firefox 58: https://bugzilla.mozilla.org/show_bug.cgi?id=1403027
Starting from Perfume.js v5.0.0-rc.1, we are going to remove this limitation, and we are going to monitor any new open issues and address them immediately.

Having both `duration` and 	`data` inside the `analyticsTracker`, it started causing some confusion. Starting from v5, we will keep only `data` and have any information from `duration` contained inside `data`. Please make sure to change the code inside your `analyticsTracker`.

## 4.8.1 (2020-2-24)

* **feat:** added serviceWorkerStatus in navigatorInfo

## 4.8.0 (2020-2-23)

* **feat:** added support for Cumulative Layout Shift score [#80](https://github.com/Zizzamia/perfume.js/issues/80)

## 4.7.5 (2020-2-22)

* **fix:** missed new property as reserved words

## 4.7.4 (2020-2-22)

* **fix:** replaced isLowEnd with isLowEndDevice and isLowEndExperience

## 4.7.3 (2020-2-21)

* **fix:** moved isLowEnd inside navigatorInformation object

## 4.7.2 (2020-2-21)

* **feat:** added isLowEnd property based on Adaptive Data Loading perfomance pattern

## 4.7.1 (2020-1-15)

* **fix:** added navigatorInformation to reserved properties 

## 4.7.0 (2020-1-11)

* **feat:** added hardwareConcurrency and deviceMemory support

### Breaking Changes

* **refactor:** made FP, FCP and FID as default metrics.

## 4.6.0 (2019-12-3)

* **fix:** restore UMD module breaking [#95](https://github.com/Zizzamia/perfume.js/issues/95)

## 4.5.0 (2019-12-1)

* **fix:** transferSize value in getNavigationTiming

## 4.4.0 (2019-11-30)

* **feat:** added network information support [#94](https://github.com/Zizzamia/perfume.js/issues/94)
* **feat:** added Clear method [#71](https://github.com/Zizzamia/perfume.js/issues/71)
* **feat:** allowed `endPaint` to accept an `eventProperties` object to do custom reporting [#68](https://github.com/Zizzamia/perfume.js/issues/68)

## 4.3.0 (2019-11-17)

* **fix:** total value for data consumption

## 4.2.0 (2019-11-17)

* **feat:** added Resource Timining support
* **feat:** added Data Consumption metric
* **feat:** added Largest Contentful Paint support
* **refactor:** reduced the library from over 4Kb to 1.9Kb gzip

## 3.0.3 (2019-10-17)

* **fix:**  pushTask is undefined during hot-reloading [#88](https://github.com/Zizzamia/perfume.js/issues/88)

## 3.0.2 (2019-10-14)

* **fix:** added check in case Navigation Timing is not supported

## 3.0.1 (2019-10-14)

* **fix:** check if `window.performance.mark` is supported when used `.start()` or `.end()` 

## 3.0.0 (2019-10-14)

* **feat:** added Navigation Timing [#83](https://github.com/Zizzamia/perfume.js/issues/83)
* **feat:** added more flexibility for log, sendTiming and analyticsTracker arguments [#70](https://github.com/Zizzamia/perfume.js/issues/70)
* **feat:** Added initial support for Data Consumption [#85](https://github.com/Zizzamia/perfume.js/issues/85)
* **feat:** Added support to retrieve buffered FP/FCP events [#81](https://github.com/Zizzamia/perfume.js/issues/81)
* **feat:** Added support for first-input and removed EmulatedPerformance [#60](https://github.com/Zizzamia/perfume.js/issues/60) [#82](https://github.com/Zizzamia/perfume.js/issues/82)
* **feat:** Replace Map by plain old objects to support more browsers [#78](https://github.com/Zizzamia/perfume.js/pull/78)

### Breaking Changes

* **refactor:** removed default Google Analytics support, instead analyticsTracker will be the default method to communicate with the backend.
* **refactor:** `log`, `sendTiming` and `analyticsTracker` gets one solo options object instead of the original arguments
* **refactor:** Dropped support for **EmulatedPerformance**
* **feat:** Discard queued tasks if running them as microtasks isn't supported [#77](https://github.com/Zizzamia/perfume.js/pull/77)

## 3.0.0-rc.11 (2019-10-13)

* **feat:** added Navigation Timing [#83](https://github.com/Zizzamia/perfume.js/issues/83)

### Breaking Changes

* **refactor:** removed default Google Analytics support, instead analyticsTracker will be the default method to communicate with the backend.

## 3.0.0-rc.10 (2019-9-29)

* **feat:** added more flexibility for log, `sendTiming` and `analyticsTracker` arguments [#70](https://github.com/Zizzamia/perfume.js/issues/70)

### Breaking Changes

* **refactor:** `log`, `sendTiming` and `analyticsTracker` gets one solo options object instead of the original arguments

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
