"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameError = void 0;
class GameError {
    constructor(code, message) {
        this.message = message || code;
    }
}
exports.GameError = GameError;
