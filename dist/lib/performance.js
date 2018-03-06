"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tti_polyfill_1 = require("tti-polyfill");
var Performance = /** @class */ (function () {
    function Performance() {
        this.timeToInteractiveDuration = 0;
        this.ttiPolyfill = tti_polyfill_1.default;
    }
    /**
     * True if the browser supports the Navigation Timing API,
     * User Timing API and the PerformanceObserver Interface.
     * In Safari, the User Timing API (performance.mark()) is not available,
     * so the DevTools timeline will not be annotated with marks.
     * Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
     * Support: developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
     *
     * @type {boolean}
     */
    Performance.supported = function () {
        return window.performance
            && !!performance.now
            && !!performance.mark;
    };
    /**
     * For now only Chrome fully support the PerformanceObserver interface
     * and the entryType "paint".
     * Firefox 58: https://bugzilla.mozilla.org/show_bug.cgi?id=1403027
     *
     * @type {boolean}
     */
    Performance.supportedPerformanceObserver = function () {
        return window.chrome;
    };
    /**
     * True if the browser supports the PerformanceLongTaskTiming interface.
     * Support: developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
     *
     * @type {boolean}
     */
    Performance.supportedLongTask = function () {
        return "PerformanceLongTaskTiming" in window;
    };
    /**
     * When performance API available
     * returns a DOMHighResTimeStamp, measured in milliseconds, accurate to five
     * thousandths of a millisecond (5 microseconds).
     * @type {number}
     */
    Performance.prototype.now = function () {
        return window.performance.now();
    };
    /**
     * @param {string} metricName
     * @param {string} type
     */
    Performance.prototype.mark = function (metricName, type) {
        var mark = "mark_" + metricName + "_" + type;
        window.performance.mark(mark);
    };
    /**
     * @param {string} metricName
     * @param {object} metrics
     * @param {string} endMark
     */
    Performance.prototype.measure = function (metricName, metrics) {
        var startMark = "mark_" + metricName + "_start";
        var endMark = "mark_" + metricName + "_end";
        window.performance.measure(metricName, startMark, endMark);
        return this.getDurationByMetric(metricName, metrics);
    };
    /**
     * First Paint is essentially the paint after which
     * the biggest above-the-fold layout change has happened.
     * PerformanceObserver subscribes to performance events as they happen
     * and respond to them asynchronously.
     * entry.name will be either 'first-paint' or 'first-contentful-paint'
     *
     * @param {any} cb
     */
    Performance.prototype.firstContentfulPaint = function (cb) {
        this.perfObserver = new PerformanceObserver(this.performanceObserverCb.bind(this, cb));
        this.perfObserver.observe({ entryTypes: ["paint"] });
    };
    /**
     * Get the duration of the timing metric or -1 if there a measurement has
     * not been made by the User Timing API
     *
     * @param {string} metricName
     * @param {any} metrics
     */
    Performance.prototype.getDurationByMetric = function (metricName, metrics) {
        var entry = this.getMeasurementForGivenName(metricName);
        if (entry && entry.entryType === "measure") {
            return entry.duration;
        }
        return -1;
    };
    /**
     * Return the last PerformanceEntry objects for the given name.
     *
     * @param {string} metricName
     */
    Performance.prototype.getMeasurementForGivenName = function (metricName) {
        var entries = window.performance.getEntriesByName(metricName);
        return entries[entries.length - 1];
    };
    /**
     * @param {any} cb
     * @param {PerformanceObserverEntryList} entryList
     */
    Performance.prototype.performanceObserverCb = function (cb, entryList) {
        var entries = entryList.getEntries()
            .filter(function (performancePaintTiming) {
            return performancePaintTiming.name === "first-contentful-paint";
        });
        if (entries.length) {
            cb(entries[0]);
            this.perfObserver.disconnect();
        }
    };
    /**
     * The polyfill exposes a getFirstConsistentlyInteractive() method,
     * which returns a promise that resolves with the TTI value.
     *
     * The getFirstConsistentlyInteractive() method accepts an optional
     * startTime configuration option, allowing you to specify a lower bound
     * for which you know your app cannot be interactive before.
     * By default the polyfill uses DOMContentLoaded as the start time,
     * but it's often more accurate to use something like the moment your hero elements
     * are visible or the point when you know all your event listeners have been added.
     *
     * @param {number} minValue
     * @param {any} cb
     */
    Performance.prototype.timeToInteractive = function (minValue, cb) {
        this.ttiPolyfill.getFirstConsistentlyInteractive({ minValue: minValue }).then(cb);
    };
    return Performance;
}());
exports.default = Performance;
//# sourceMappingURL=performance.js.map