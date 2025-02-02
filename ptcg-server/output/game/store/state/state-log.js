"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateLog = void 0;
class StateLog {
    constructor(message, params = {}, client = 0) {
        this.id = 0;
        this.message = message;
        this.params = params;
        this.client = client;
    }
}
exports.StateLog = StateLog;
