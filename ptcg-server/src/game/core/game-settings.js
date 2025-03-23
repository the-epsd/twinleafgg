"use strict";
exports.__esModule = true;
exports.GameSettings = void 0;
var card_types_1 = require("../store/card/card-types");
var rules_1 = require("../store/state/rules");
var GameSettings = /** @class */ (function () {
    function GameSettings() {
        this.rules = new rules_1.Rules();
        this.timeLimit = 900;
        this.recordingEnabled = true;
        this.format = card_types_1.Format.STANDARD;
    }
    return GameSettings;
}());
exports.GameSettings = GameSettings;
