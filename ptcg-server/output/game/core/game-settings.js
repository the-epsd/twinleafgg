"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSettings = void 0;
const card_types_1 = require("../store/card/card-types");
const rules_1 = require("../store/state/rules");
class GameSettings {
    constructor() {
        this.rules = new rules_1.Rules();
        this.timeLimit = 900;
        this.recordingEnabled = true;
        this.format = card_types_1.Format.STANDARD;
    }
}
exports.GameSettings = GameSettings;
