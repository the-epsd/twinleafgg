"use strict";
exports.__esModule = true;
exports.Scheduler = void 0;
var config_1 = require("../config");
var Scheduler = /** @class */ (function () {
    function Scheduler() {
        this.jobs = [];
    }
    Scheduler.getInstance = function () {
        return Scheduler.instance;
    };
    Scheduler.prototype.run = function (callback, counter) {
        var _this = this;
        if (counter === void 0) { counter = 1; }
        // Job disabled in the config file, do not add it to scheduler
        if (counter === 0) {
            return;
        }
        this.jobs.push({ counter: counter, callback: callback, value: 0 });
        if (this.intervalRef !== undefined || this.timeoutRef !== undefined) {
            return;
        }
        if (!config_1.config.core.schedulerStartNextHour) {
            this.startInterval();
            return;
        }
        // wait with the initialization till next hour
        var msInHour = 60 * 60 * 1000;
        var msToNextHour = msInHour - new Date().getTime() % msInHour;
        this.timeoutRef = setTimeout(function () {
            _this.timeoutRef = undefined;
            _this.startInterval();
        }, msToNextHour);
    };
    Scheduler.prototype.startInterval = function () {
        var _this = this;
        if (this.jobs.length === 0 || this.intervalRef !== undefined) {
            return;
        }
        this.intervalRef = setInterval(function () {
            _this.jobs.forEach(function (job) {
                job.value += 1;
                if (job.value >= job.counter) {
                    job.value = 0;
                    job.callback();
                }
            });
        }, config_1.config.core.schedulerInterval);
    };
    Scheduler.prototype.stop = function (callback) {
        var index = this.jobs.findIndex(function (job) { return job.callback === callback; });
        if (index !== -1) {
            this.jobs.splice(index, 1);
            if (this.jobs.length === 0) {
                if (this.timeoutRef !== undefined) {
                    clearTimeout(this.timeoutRef);
                    this.timeoutRef = undefined;
                }
                if (this.intervalRef !== undefined) {
                    clearInterval(this.intervalRef);
                    this.intervalRef = undefined;
                }
            }
        }
    };
    Scheduler.instance = new Scheduler();
    return Scheduler;
}());
exports.Scheduler = Scheduler;
