"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptResolver = void 0;
const state_score_1 = require("../state-score/state-score");
class PromptResolver {
    constructor(options) {
        this.options = options;
        this.stateScore = new state_score_1.StateScore(this.options);
    }
    getStateScore(state, playerId) {
        return this.stateScore.getScore(state, playerId);
    }
}
exports.PromptResolver = PromptResolver;
