var perfume = (function () {
'use strict';

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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var ttiPolyfill = createCommonjsModule(function (module) {
(function(){var h="undefined"!=typeof window&&window===this?this:"undefined"!=typeof commonjsGlobal&&null!=commonjsGlobal?commonjsGlobal:this,k="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value);};function l(){l=function(){};h.Symbol||(h.Symbol=m);}var n=0;function m(a){return"jscomp_symbol_"+(a||"")+n++}
function p(){l();var a=h.Symbol.iterator;a||(a=h.Symbol.iterator=h.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&k(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return q(this)}});p=function(){};}function q(a){var b=0;return r(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function r(a){p();a={next:a};a[h.Symbol.iterator]=function(){return this};return a}function t(a){p();var b=a[Symbol.iterator];return b?b.call(a):q(a)}
function u(a){if(!(a instanceof Array)){a=t(a);for(var b,c=[];!(b=a.next()).done;)c.push(b.value);a=c;}return a}var v=0;function w(a,b){var c=XMLHttpRequest.prototype.send,d=v++;XMLHttpRequest.prototype.send=function(f){for(var e=[],g=0;g<arguments.length;++g)e[g-0]=arguments[g];var E=this;a(d);this.addEventListener("readystatechange",function(){4===E.readyState&&b(d);});return c.apply(this,e)};}
function x(a,b){var c=fetch;fetch=function(d){for(var f=[],e=0;e<arguments.length;++e)f[e-0]=arguments[e];return new Promise(function(d,e){var g=v++;a(g);c.apply(null,[].concat(u(f))).then(function(a){b(g);d(a);},function(a){b(a);e(a);});})};}var y="img script iframe link audio video source".split(" ");function z(a,b){a=t(a);for(var c=a.next();!c.done;c=a.next())if(c=c.value, b.includes(c.nodeName.toLowerCase())||z(c.children,b))return!0;return!1}
function A(a){var b=new MutationObserver(function(c){c=t(c);for(var b=c.next();!b.done;b=c.next())b=b.value, "childList"==b.type&&z(b.addedNodes,y)?a(b):"attributes"==b.type&&y.includes(b.target.tagName.toLowerCase())&&a(b);});b.observe(document,{attributes:!0,childList:!0,subtree:!0,attributeFilter:["href","src"]});return b}
function B(a,b){if(2<a.length)return performance.now();var c=[];b=t(b);for(var d=b.next();!d.done;d=b.next())d=d.value, c.push({timestamp:d.start,type:"requestStart"}), c.push({timestamp:d.end,type:"requestEnd"});b=t(a);for(d=b.next();!d.done;d=b.next())c.push({timestamp:d.value,type:"requestStart"});c.sort(function(a,b){return a.timestamp-b.timestamp});a=a.length;for(b=c.length-1;0<=b;b--)switch(d=c[b], d.type){case "requestStart":a--;break;case "requestEnd":a++;if(2<a)return d.timestamp;break;default:throw Error("Internal Error: This should never happen");
}return 0}function C(a){a=a?a:{};this.w=!!a.useMutationObserver;this.u=a.minValue||null;a=window.__tti&&window.__tti.e;var b=window.__tti&&window.__tti.o;this.a=a?a.map(function(a){return{start:a.startTime,end:a.startTime+a.duration}}):[];b&&b.disconnect();this.b=[];this.f=new Map;this.j=null;this.v=-Infinity;this.i=!1;this.h=this.c=this.s=null;w(this.m.bind(this),this.l.bind(this));x(this.m.bind(this),this.l.bind(this));D(this);this.w&&(this.h=A(this.B.bind(this)));}
C.prototype.getFirstConsistentlyInteractive=function(){var a=this;return new Promise(function(b){a.s=b;"complete"==document.readyState?F(a):window.addEventListener("load",function(){F(a);});})};function F(a){a.i=!0;var b=0<a.a.length?a.a[a.a.length-1].end:0,c=B(a.g,a.b);G(a,Math.max(c+5E3,b));}
function G(a,b){!a.i||a.v>b||(clearTimeout(a.j), a.j=setTimeout(function(){var b=performance.timing.navigationStart,d=B(a.g,a.b),b=(window.a&&window.a.A?1E3*window.a.A().C-b:0)||performance.timing.domContentLoadedEventEnd-b;if(a.u)var f=a.u;else performance.timing.domContentLoadedEventEnd?(f=performance.timing, f=f.domContentLoadedEventEnd-f.navigationStart):f=null;var e=performance.now();null===f&&G(a,Math.max(d+5E3,e+1E3));var g=a.a;5E3>e-d?d=null:(d=g.length?g[g.length-1].end:b, d=5E3>e-d?null:Math.max(d,
f));d&&(a.s(d), clearTimeout(a.j), a.i=!1, a.c&&a.c.disconnect(), a.h&&a.h.disconnect());G(a,performance.now()+1E3);},b-performance.now()), a.v=b);}
function D(a){a.c=new PerformanceObserver(function(b){b=t(b.getEntries());for(var c=b.next();!c.done;c=b.next())if(c=c.value, "resource"===c.entryType&&(a.b.push({start:c.fetchStart,end:c.responseEnd}), G(a,B(a.g,a.b)+5E3)), "longtask"===c.entryType){var d=c.startTime+c.duration;a.a.push({start:c.startTime,end:d});G(a,d+5E3);}});a.c.observe({entryTypes:["longtask","resource"]});}C.prototype.m=function(a){this.f.set(a,performance.now());};C.prototype.l=function(a){this.f.delete(a);};
C.prototype.B=function(){G(this,performance.now()+5E3);};h.Object.defineProperties(C.prototype,{g:{configurable:!0,enumerable:!0,get:function(){return[].concat(u(this.f.values()))}}});var H={getFirstConsistentlyInteractive:function(a){a=a?a:{};return"PerformanceLongTaskTiming"in window?(new C(a)).getFirstConsistentlyInteractive():Promise.resolve(null)}};
"undefined"!='object'&&module.exports?module.exports=H:"function"===typeof undefined&&undefined.amd?undefined("ttiPolyfill",[],function(){return H}):window.ttiPolyfill=H;})();

});

var Performance = /** @class */ (function () {
    function Performance() {
        this.timeToInteractiveDuration = 0;
        this.ttiPolyfill = ttiPolyfill;
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
        var _this = this;
        var entries = entryList.getEntries();
        cb(entries);
        entries.forEach(function (performancePaintTiming) {
            if (_this.config.firstContentfulPaint
                && performancePaintTiming.name === "first-contentful-paint") {
                _this.perfObserver.disconnect();
            }
        });
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

/*!
 * Perfume.js v0.6.4 (http://zizzamia.github.io/perfume)
 * Copyright 2018 The Perfume Authors (https://github.com/Zizzamia/perfume.js/graphs/contributors)
 * Licensed under MIT (https://github.com/Zizzamia/perfume.js/blob/master/LICENSE)
 * @license
 */
var Perfume = /** @class */ (function () {
    function Perfume(options) {
        if (options === void 0) { options = {}; }
        this.config = {
            firstPaint: false,
            firstContentfulPaint: false,
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

return Perfume;

}());
//# sourceMappingURL=perfume.iife.js.map
