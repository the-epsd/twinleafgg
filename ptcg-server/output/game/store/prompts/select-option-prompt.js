"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOptionPrompt = void 0;
const prompt_1 = require("./prompt");
class SelectOptionPrompt extends prompt_1.Prompt {
    constructor(playerId, message, values, options) {
        super(playerId);
        this.message = message;
        this.values = values;
        this.type = 'SelectOption';
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            defaultValue: 0,
        }, options);
    }
}
exports.SelectOptionPrompt = SelectOptionPrompt;
