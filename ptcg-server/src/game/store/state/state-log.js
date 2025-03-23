"use strict";
exports.__esModule = true;
exports.StateLog = void 0;
var StateLog = /** @class */ (function () {
    function StateLog(message, params, client) {
        if (params === void 0) { params = {}; }
        if (client === void 0) { client = 0; }
        this.id = 0;
        this.message = message;
        this.params = params;
        this.client = client;
    }
    return StateLog;
}());
exports.StateLog = StateLog;
