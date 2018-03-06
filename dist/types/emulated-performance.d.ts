import PerformImpl from "./performance-impl";
declare global  {
}
export default class EmulatedPerformance implements PerformImpl {
    config: any;
    /**
     * When performance API is not available
     * returns Date.now that is limited to one-millisecond resolution.
     *
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
     */
    measure(metricName: string, metrics: object): number;
    /**
     * First Paint is essentially the paint after which
     * the biggest above-the-fold layout change has happened.
     * Uses setTimeout to retrieve FCP
     *
     * @param {any} cb
     */
    firstContentfulPaint(cb: any): void;
    /**
     * Get the duration of the timing metric or -1 if there a measurement has
     * not been made by now() fallback.
     *
     * @param {string} metricName
     * @param {metrics} any
     */
    private getDurationByMetric(metricName, metrics);
    /**
     * http://msdn.microsoft.com/ff974719
     * developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart
     *
     * @param {PerformancePaintTiming} performancePaintTiming
     */
    private getFirstPaint();
}
