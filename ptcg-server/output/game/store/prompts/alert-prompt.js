"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertPrompt = void 0;
const prompt_1 = require("./prompt");
class AlertPrompt extends prompt_1.Prompt {
    constructor(playerId, message) {
        super(playerId);
        this.message = message;
        this.type = 'Alert';
    }
}
exports.AlertPrompt = AlertPrompt;
