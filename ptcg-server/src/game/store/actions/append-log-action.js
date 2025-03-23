"use strict";
exports.__esModule = true;
exports.AppendLogAction = void 0;
var AppendLogAction = /** @class */ (function () {
    function AppendLogAction(id, message, params) {
        this.id = id;
        this.message = message;
        this.params = params;
        this.type = 'APPEND_LOG_ACTION';
    }
    return AppendLogAction;
}());
exports.AppendLogAction = AppendLogAction;
