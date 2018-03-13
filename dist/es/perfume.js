/*!
 * Perfume.js v0.6.4 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
import EmulatedPerformance from "./emulated-performance";
import Performance from "./performance";
var Perfume = /** @class */ (function () {
    function Perfume(options) {
        if (options === void 0) { options = {}; }
        this.config = {
            firstContentfulPaint: false,
            firstPaint: false,
            googleAnalytics: {
                enable: false,
                timingVar: "name",
            },
            logPrefix: "⚡️ Perfume.js:",
            logging: true,
            timeToInteractive: false,
        };
        this.firstPaintDuration = 0;
        this.firstContentfulPaintDuration = 0;
        this.timeToInteractiveDuration = 0;
        this.metrics = {};
        this.config = Object.assign({}, this.config, options);
        // Init performance implementation
        this.perf = Performance.supported() ? new Performance() : new EmulatedPerformance();
        this.perf.config = this.config;
        // Init First Contentful Paint
        if (Performance.supportedPerformanceObserver()) {
            this.perf.firstContentfulPaint(this.firstContentfulPaintCb.bind(this));
        }
        else {
            this.perfEmulated = new EmulatedPerformance();
            this.perfEmulated.firstContentfulPaint(this.firstContentfulPaintCb.bind(this));
        }
    }
    /**
     * Start performance measurement
     *
     * @param {string} metricName
     */
    Perfume.prototype.start = function (metricName) {
        if (!this.checkMetricName(metricName)) {
            return;
        }
        if (this.metrics[metricName]) {
            window.console.warn(this.config.logPrefix, "Recording already started.");
            return;
        }
        this.metrics[metricName] = {
            end: 0,
            start: this.perf.now(),
        };
        this.perf.mark(metricName, "start");
    };
    /**
     * End performance measurement
     *
     * @param {string} metricName
     */
    Perfume.prototype.end = function (metricName) {
        if (!this.checkMetricName(metricName)) {
            return;
        }
        if (!this.metrics[metricName]) {
            window.console.warn(this.config.logPrefix, "Recording already stopped.");
            return;
        }
        this.metrics[metricName].end = this.perf.now();
        this.perf.mark(metricName, "end");
        var duration = this.perf.measure(metricName, this.metrics);
        if (this.config.logging) {
            this.log(metricName, duration);
        }
        delete this.metrics[metricName];
        this.sendTiming(metricName, duration);
        return duration;
    };
    /**
     * End performance measurement after first paint from the beging of it
     *
     * @param {string} metricName
     */
    Perfume.prototype.endPaint = function (metricName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var duration = _this.end(metricName);
                resolve(duration);
            });
        });
    };
    /**
     * Coloring Text in Browser Console
     *
     * @param {string} metricName
     * @param {number} duration
     */
    Perfume.prototype.log = function (metricName, duration) {
        if (!metricName) {
            window.console.warn(this.config.logPrefix, "Please provide a metric name");
            return;
        }
        var durationMs = duration.toFixed(2);
        var style = "color: #ff6d00;font-size:12px;";
        var text = "%c " + this.config.logPrefix + " " + metricName + " " + durationMs + " ms";
        window.console.log(text, style);
    };
    /**
     * @param {string} metricName
     */
    Perfume.prototype.checkMetricName = function (metricName) {
        if (metricName) {
            return true;
        }
        window.console.warn(this.config.logPrefix, "Please provide a metric name");
        return false;
    };
    /**
     * @param {object} entry
     */
    Perfume.prototype.firstContentfulPaintCb = function (entries) {
        var _this = this;
        var firstContentfulPaintDuration;
        entries.forEach(function (performancePaintTiming) {
            if (_this.config.firstPaint
                && performancePaintTiming.name === "first-paint") {
                _this.logFCP(performancePaintTiming.startTime, "First Paint", "firstPaint");
            }
            if (_this.config.firstContentfulPaint
                && performancePaintTiming.name === "first-contentful-paint") {
                _this.logFCP(performancePaintTiming.startTime, "First Contentful Paint", "firstContentfulPaint");
            }
            if (performancePaintTiming.name === "first-contentful-paint") {
                firstContentfulPaintDuration = performancePaintTiming.startTime;
            }
        });
        if (Performance.supported()
            && Performance.supportedPerformanceObserver()
            && Performance.supportedLongTask()
            && this.config.timeToInteractive
            && firstContentfulPaintDuration) {
            this.perf.timeToInteractive(firstContentfulPaintDuration, this.timeToInteractiveCb.bind(this));
        }
    };
    /**
     * @param {number} timeToInteractive
     */
    Perfume.prototype.timeToInteractiveCb = function (timeToInteractive) {
        this.timeToInteractiveDuration = timeToInteractive;
        if (this.timeToInteractiveDuration) {
            this.log("Time to interactive", this.timeToInteractiveDuration);
        }
        if (this.config.timeToInteractiveCb) {
            this.config.timeToInteractiveCb(this.timeToInteractiveDuration);
        }
        this.sendTiming("timeToInteractive", this.timeToInteractiveDuration);
    };
    /**
     * @param {number} duration
     */
    Perfume.prototype.logFCP = function (duration, logText, metricName) {
        if (metricName === "firstPaint") {
            this.firstPaintDuration = duration;
        }
        if (metricName === "firstContentfulPaint") {
            this.firstContentfulPaintDuration = duration;
        }
        this.log(logText, duration);
        this.sendTiming(metricName, duration);
    };
    /**
     * Sends the User timing measure to Google Analytics.
     * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
     * timingCategory: metricName
     * timingVar: googleAnalytics.timingVar
     * timingValue: The value of duration rounded to the nearest integer
     * @param {string} metricName
     * @param {number} duration
     */
    Perfume.prototype.sendTiming = function (metricName, duration) {
        if (!this.config.googleAnalytics.enable) {
            return;
        }
        if (!window.ga) {
            window.console.warn(this.config.logPrefix, "Google Analytics has not been loaded");
            return;
        }
        var durationInteger = Math.round(duration);
        window.ga("send", "timing", metricName, this.config.googleAnalytics.timingVar, durationInteger);
    };
    return Perfume;
}());
export default Perfume;
//# sourceMappingURL=perfume.js.map