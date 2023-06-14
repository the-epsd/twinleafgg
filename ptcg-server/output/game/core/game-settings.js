"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSettings = void 0;
const rules_1 = require("../store/state/rules");
class GameSettings {
    constructor() {
        this.rules = new rules_1.Rules();
        this.timeLimit = 1800;
        this.recordingEnabled = true;
    }
}
exports.GameSettings = GameSettings;
