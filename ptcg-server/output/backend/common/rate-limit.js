"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimit = void 0;
const config_1 = require("../../config");
class RateLimit {
    constructor() {
        this.items = [];
    }
    static getInstance() {
        return RateLimit.instance;
    }
    isLimitExceeded(ip, type = 'http') {
        this.deleteExpired();
        const rateLimit = this.items.find(i => i.ip === ip && i.type === type);
        if (rateLimit === undefined) {
            return false;
        }
        const limit = type === 'websocket'
            ? config_1.config.backend.wsRateLimitCount || config_1.config.backend.rateLimitCount * 2
            : config_1.config.backend.rateLimitCount;
        return rateLimit.count >= limit;
    }
    increment(ip, type = 'http') {
        let rateLimit = this.items.find(i => i.ip === ip && i.type === type);
        if (rateLimit === undefined) {
            rateLimit = { ip, type, lastRequest: 0, count: 0 };
            this.items.push(rateLimit);
        }
        rateLimit.lastRequest = Date.now();
        rateLimit.count += 1;
    }
    getCurrentCount(ip, type = 'http') {
        const rateLimit = this.items.find(i => i.ip === ip && i.type === type);
        return (rateLimit === null || rateLimit === void 0 ? void 0 : rateLimit.count) || 0;
    }
    getRetryAfter(ip, type = 'http') {
        const rateLimit = this.items.find(i => i.ip === ip && i.type === type);
        if (!rateLimit) {
            return 0;
        }
        const timeLeft = (rateLimit.lastRequest + config_1.config.backend.rateLimitTime) - Date.now();
        return Math.max(0, timeLeft);
    }
    deleteExpired() {
        const expire = Date.now() - config_1.config.backend.rateLimitTime;
        this.items = this.items.filter(i => i.lastRequest >= expire);
    }
}
exports.RateLimit = RateLimit;
RateLimit.instance = new RateLimit();
