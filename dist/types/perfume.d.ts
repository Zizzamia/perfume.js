declare global  {
    interface Window {
        ga: any;
    }
}
export default class Perfume {
    config: {
        firstPaint: boolean;
        firstContentfulPaint: boolean;
        googleAnalytics: {
            enable: boolean;
            timingVar: string;
        };
        logPrefix: string;
        logging: boolean;
        timeToInteractive: boolean;
        timeToInteractiveCb?: any;
    };
    firstPaintDuration: number;
    firstContentfulPaintDuration: number;
    timeToInteractiveDuration: number;
    private metrics;
    private perf;
    private perfEmulated;
    constructor(options?: any);
    /**
     * Start performance measurement
     *
     * @param {string} metricName
     */
    start(metricName: string): void;
    /**
     * End performance measurement
     *
     * @param {string} metricName
     */
    end(metricName: string): any;
    /**
     * End performance measurement after first paint from the beging of it
     *
     * @param {string} metricName
     */
    endPaint(metricName: string): Promise<{}>;
    /**
     * Coloring Text in Browser Console
     *
     * @param {string} metricName
     * @param {number} duration
     */
    log(metricName: string, duration: number): void;
    /**
     * @param {string} metricName
     */
    private checkMetricName(metricName);
    /**
     * @param {object} entry
     */
    private firstContentfulPaintCb(entries);
    /**
     * @param {number} timeToInteractive
     */
    private timeToInteractiveCb(timeToInteractive);
    /**
     * @param {number} duration
     */
    private logFCP(duration, logText, metricName);
    /**
     * Sends the User timing measure to Google Analytics.
     * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
     * timingCategory: metricName
     * timingVar: googleAnalytics.timingVar
     * timingValue: The value of duration rounded to the nearest integer
     * @param {string} metricName
     * @param {number} duration
     */
    private sendTiming(metricName, duration);
}
export {};
