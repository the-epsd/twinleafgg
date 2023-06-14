"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinFlipPrompt = void 0;
const prompt_1 = require("./prompt");
class CoinFlipPrompt extends prompt_1.Prompt {
    constructor(playerId, message) {
        super(playerId);
        this.message = message;
        this.type = 'Coin flip';
    }
}
exports.CoinFlipPrompt = CoinFlipPrompt;
