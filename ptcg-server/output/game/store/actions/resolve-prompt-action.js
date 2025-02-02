"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePromptAction = void 0;
class ResolvePromptAction {
    constructor(id, result, log) {
        this.id = id;
        this.result = result;
        this.log = log;
        this.type = 'RESOLVE_PROMPT';
    }
}
exports.ResolvePromptAction = ResolvePromptAction;
