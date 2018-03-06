import PerformImpl from "./performance-impl";
declare global  {
    interface Window {
        chrome: any;
    }
}
export default class Performance implements PerformImpl {
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
    static supported(): boolean;
    /**
     * For now only Chrome fully support the PerformanceObserver interface
     * and the entryType "paint".
     * Firefox 58: https://bugzilla.mozilla.org/show_bug.cgi?id=1403027
     *
     * @type {boolean}
     */
    static supportedPerformanceObserver(): boolean;
    /**
     * True if the browser supports the PerformanceLongTaskTiming interface.
     * Support: developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
     *
     * @type {boolean}
     */
    static supportedLongTask(): boolean;
    timeToInteractiveDuration: number;
    config: any;
    private ttiPolyfill;
    private perfObserver;
    constructor();
    /**
     * When performance API available
     * returns a DOMHighResTimeStamp, measured in milliseconds, accurate to five
     * thousandths of a millisecond (5 microseconds).
     * @type {number}
     */
    now(): number;
    /**
     * @param {string} metricName
     * @param {string} type
     */
    mark(metricName: string, type: string): void;
    /**
     * @param {string} metricName
     * @param {object} metrics
     * @param {string} endMark
     */
    measure(metricName: string, metrics: object): any;
    /**
     * First Paint is essentially the paint after which
     * the biggest above-the-fold layout change has happened.
     * PerformanceObserver subscribes to performance events as they happen
     * and respond to them asynchronously.
     * entry.name will be either 'first-paint' or 'first-contentful-paint'
     *
     * @param {any} cb
     */
    firstContentfulPaint(cb: any): any;
    /**
     * Get the duration of the timing metric or -1 if there a measurement has
     * not been made by the User Timing API
     *
     * @param {string} metricName
     * @param {any} metrics
     */
    private getDurationByMetric(metricName, metrics);
    /**
     * Return the last PerformanceEntry objects for the given name.
     *
     * @param {string} metricName
     */
    private getMeasurementForGivenName(metricName);
    /**
     * @param {any} cb
     * @param {PerformanceObserverEntryList} entryList
     */
    private performanceObserverCb(cb, entryList);
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
    private timeToInteractive(minValue, cb);
}
