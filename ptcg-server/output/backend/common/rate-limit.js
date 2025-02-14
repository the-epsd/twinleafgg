"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimit = void 0;
const config_1 = require("../../config");
class RateLimit {
    constructor() {
        this.items = [];
        this.lastCleanup = 0;
        this.CLEANUP_INTERVAL = 60000; // Clean up every minute
    }
    static getInstance() {
        return RateLimit.instance;
    }
    isLimitExceeded(ip) {
        this.cleanupIfNeeded();
        const rateLimit = this.items.find(i => i.ip === ip);
        if (rateLimit === undefined) {
            return false;
        }
        const expire = Date.now() - config_1.config.backend.rateLimitTime;
        if (rateLimit.lastRequest < expire) {
            return false;
        }
        if (rateLimit.count < config_1.config.backend.rateLimitCount) {
            return false;
        }
        return true;
    }
    increment(ip) {
        this.cleanupIfNeeded();
        let rateLimit = this.items.find(i => i.ip === ip);
        const now = Date.now();
        const expire = now - config_1.config.backend.rateLimitTime;
        if (rateLimit === undefined) {
            rateLimit = { ip, lastRequest: now, count: 1 };
            this.items.push(rateLimit);
            return;
        }
        if (rateLimit.lastRequest < expire) {
            rateLimit.count = 1;
        }
        else {
            rateLimit.count += 1;
        }
        rateLimit.lastRequest = now;
    }
    cleanupIfNeeded() {
        const now = Date.now();
        if (now - this.lastCleanup < this.CLEANUP_INTERVAL) {
            return;
        }
        const expire = now - config_1.config.backend.rateLimitTime;
        this.items = this.items.filter(i => i.lastRequest >= expire);
        this.lastCleanup = now;
    }
}
exports.RateLimit = RateLimit;
RateLimit.instance = new RateLimit();
