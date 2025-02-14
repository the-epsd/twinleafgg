"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketCache = void 0;
class SocketCache {
    constructor() {
        this.gameInfoCache = {};
        this.lastLogIdCache = {};
        this.lastUserUpdate = 0;
        this.coreInfo = null;
        this.coreInfoTimestamp = 0;
    }
}
exports.SocketCache = SocketCache;
