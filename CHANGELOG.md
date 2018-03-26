# Changelog

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
