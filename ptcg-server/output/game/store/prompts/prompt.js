"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
class Prompt {
    constructor(playerId) {
        this.playerId = playerId;
        this.id = 0;
    }
    decode(result, state) {
        return result;
    }
    validate(result, state) {
        return true;
    }
}
exports.Prompt = Prompt;
