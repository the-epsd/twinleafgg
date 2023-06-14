"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitePlayerPrompt = void 0;
const prompt_1 = require("./prompt");
class InvitePlayerPrompt extends prompt_1.Prompt {
    constructor(playerId, message) {
        super(playerId);
        this.message = message;
        this.type = 'Invite player';
    }
}
exports.InvitePlayerPrompt = InvitePlayerPrompt;
