"use strict";
exports.__esModule = true;
exports.GameError = void 0;
var GameError = /** @class */ (function () {
    function GameError(code, message) {
        this.message = message || code;
    }
    return GameError;
}());
exports.GameError = GameError;
