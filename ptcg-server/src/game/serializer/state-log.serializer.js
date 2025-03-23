"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.StateLogSerializer = void 0;
var state_log_1 = require("../store/state/state-log");
var StateLogSerializer = /** @class */ (function () {
    function StateLogSerializer() {
        this.types = ['StateLog'];
        this.classes = [state_log_1.StateLog];
    }
    StateLogSerializer.prototype.serialize = function (stateLog) {
        return __assign(__assign({}, stateLog), { _type: 'StateLog' });
    };
    StateLogSerializer.prototype.deserialize = function (data, context) {
        delete data._type;
        var instance = new state_log_1.StateLog(data.message, data.params, data.client);
        return Object.assign(instance, data);
    };
    return StateLogSerializer;
}());
exports.StateLogSerializer = StateLogSerializer;
