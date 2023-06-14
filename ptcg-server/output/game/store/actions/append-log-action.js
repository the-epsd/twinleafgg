"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppendLogAction = void 0;
class AppendLogAction {
    constructor(id, message, params) {
        this.id = id;
        this.message = message;
        this.params = params;
        this.type = 'APPEND_LOG_ACTION';
    }
}
exports.AppendLogAction = AppendLogAction;
