"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const config_1 = require("../config");
class Scheduler {
    constructor() {
        this.jobs = [];
    }
    static getInstance() {
        return Scheduler.instance;
    }
    run(callback, counter = 1) {
        // Job disabled in the config file, do not add it to scheduler
        if (counter === 0) {
            return;
        }
        this.jobs.push({ counter, callback, value: 0 });
        if (this.intervalRef !== undefined || this.timeoutRef !== undefined) {
            return;
        }
        if (!config_1.config.core.schedulerStartNextHour) {
            this.startInterval();
            return;
        }
        // wait with the initialization till next hour
        const msInHour = 60 * 60 * 1000;
        const msToNextHour = msInHour - new Date().getTime() % msInHour;
        this.timeoutRef = setTimeout(() => {
            this.timeoutRef = undefined;
            this.startInterval();
        }, msToNextHour);
    }
    startInterval() {
        if (this.jobs.length === 0 || this.intervalRef !== undefined) {
            return;
        }
        this.intervalRef = setInterval(() => {
            this.jobs.forEach(job => {
                job.value += 1;
                if (job.value >= job.counter) {
                    job.value = 0;
                    job.callback();
                }
            });
        }, config_1.config.core.schedulerInterval);
    }
    stop(callback) {
        const index = this.jobs.findIndex(job => job.callback === callback);
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
    }
}
exports.Scheduler = Scheduler;
Scheduler.instance = new Scheduler();
