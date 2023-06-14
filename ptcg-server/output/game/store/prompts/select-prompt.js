"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectPrompt = void 0;
const prompt_1 = require("./prompt");
class SelectPrompt extends prompt_1.Prompt {
    constructor(playerId, message, values, options) {
        super(playerId);
        this.message = message;
        this.values = values;
        this.type = 'Select';
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            defaultValue: 0,
        }, options);
    }
}
exports.SelectPrompt = SelectPrompt;
