"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateLogSerializer = void 0;
const state_log_1 = require("../store/state/state-log");
class StateLogSerializer {
    constructor() {
        this.types = ['StateLog'];
        this.classes = [state_log_1.StateLog];
    }
    serialize(stateLog) {
        return Object.assign(Object.assign({}, stateLog), { _type: 'StateLog' });
    }
    deserialize(data, context) {
        delete data._type;
        const instance = new state_log_1.StateLog(data.message, data.params, data.client);
        return Object.assign(instance, data);
    }
}
exports.StateLogSerializer = StateLogSerializer;
