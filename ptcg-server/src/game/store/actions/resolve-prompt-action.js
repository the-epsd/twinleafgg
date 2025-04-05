"use strict";
exports.__esModule = true;
exports.ResolvePromptAction = void 0;
var ResolvePromptAction = /** @class */ (function () {
    function ResolvePromptAction(id, result, log) {
        this.id = id;
        this.result = result;
        this.log = log;
        this.type = 'RESOLVE_PROMPT';
    }
    return ResolvePromptAction;
}());
exports.ResolvePromptAction = ResolvePromptAction;
