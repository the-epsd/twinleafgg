"use strict";
exports.__esModule = true;
exports.Prompt = void 0;
var Prompt = /** @class */ (function () {
    function Prompt(playerId) {
        this.playerId = playerId;
        this.id = 0;
    }
    Prompt.prototype.decode = function (result, state) {
        return result;
    };
    Prompt.prototype.validate = function (result, state) {
        return true;
    };
    return Prompt;
}());
exports.Prompt = Prompt;
