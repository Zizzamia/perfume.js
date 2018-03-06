var EmulatedPerformance = /** @class */ (function () {
    function EmulatedPerformance() {
    }
    /**
     * When performance API is not available
     * returns Date.now that is limited to one-millisecond resolution.
     *
     * @type {number}
     */
    EmulatedPerformance.prototype.now = function () {
        return Date.now() / 1000;
    };
    /**
     * @param {string} metricName
     * @param {string} type
     */
    EmulatedPerformance.prototype.mark = function (metricName, type) {
        // Timeline won't be marked
    };
    /**
     * @param {string} metricName
     * @param {object} metrics
     */
    EmulatedPerformance.prototype.measure = function (metricName, metrics) {
        return this.getDurationByMetric(metricName, metrics);
    };
    /**
     * First Paint is essentially the paint after which
     * the biggest above-the-fold layout change has happened.
     * Uses setTimeout to retrieve FCP
     *
     * @param {any} cb
     */
    EmulatedPerformance.prototype.firstContentfulPaint = function (cb) {
        var _this = this;
        setTimeout(function () {
            cb(_this.getFirstPaint());
        });
    };
    /**
     * Get the duration of the timing metric or -1 if there a measurement has
     * not been made by now() fallback.
     *
     * @param {string} metricName
     * @param {metrics} any
     */
    EmulatedPerformance.prototype.getDurationByMetric = function (metricName, metrics) {
        var duration = metrics[metricName].end - metrics[metricName].start;
        return duration || 0;
    };
    /**
     * http://msdn.microsoft.com/ff974719
     * developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart
     *
     * @param {PerformancePaintTiming} performancePaintTiming
     */
    EmulatedPerformance.prototype.getFirstPaint = function () {
        var navTiming = window.performance.timing;
        var performancePaintTiming = {
            duration: 0,
            entryType: "paint",
            name: "first-contentful-paint",
            startTime: 0,
        };
        if (navTiming && navTiming.navigationStart !== 0) {
            performancePaintTiming.startTime = Date.now() - navTiming.navigationStart;
        }
        return performancePaintTiming;
    };
    return EmulatedPerformance;
}());
export default EmulatedPerformance;
//# sourceMappingURL=emulated-performance.js.map