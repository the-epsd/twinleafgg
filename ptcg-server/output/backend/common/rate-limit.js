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
    isLimitExceeded(ip) {
        this.deleteExpired();
        const rateLimit = this.items.find(i => i.ip === ip);
        if (rateLimit === undefined) {
            return false;
        }
        if (rateLimit.count < config_1.config.backend.rateLimitCount) {
            return false;
        }
        return true;
    }
    increment(ip) {
        let rateLimit = this.items.find(i => i.ip === ip);
        if (rateLimit === undefined) {
            rateLimit = { ip, lastRequest: 0, count: 0 };
            this.items.push(rateLimit);
        }
        rateLimit.lastRequest = Date.now();
        rateLimit.count += 1;
    }
    deleteExpired() {
        const expire = Date.now() - config_1.config.backend.rateLimitTime;
        this.items = this.items.filter(i => i.lastRequest >= expire);
    }
}
exports.RateLimit = RateLimit;
RateLimit.instance = new RateLimit();
