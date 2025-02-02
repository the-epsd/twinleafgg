"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateScore = void 0;
const score_1 = require("./score");
const hand_score_1 = require("./hand-score");
const opponent_score_1 = require("./opponent-score");
const player_score_1 = require("./player-score");
const special_conditions_score_1 = require("./special-conditions-score");
const active_score_1 = require("./active-score");
const bench_score_1 = require("./bench-score");
const energy_score_1 = require("./energy-score");
const damage_score_1 = require("./damage-score");
const tools_score_1 = require("./tools-score");
class StateScore extends score_1.SimpleScore {
    constructor(options) {
        super(options);
        this.options = options;
        this.handScore = new hand_score_1.HandScore(options);
        this.opponentScore = new opponent_score_1.OpponentScore(options);
        this.playerScore = new player_score_1.PlayerScore(options);
        this.specialConditionsScore = new special_conditions_score_1.SpecialConditionsScore(options);
        this.activeScore = new active_score_1.ActiveScore(options);
        this.benchScore = new bench_score_1.BenchScore(options);
        this.energyScore = new energy_score_1.EnergyScore(options);
        this.damageScore = new damage_score_1.DamageScore(options);
        this.toolsScore = new tools_score_1.ToolsScore(options);
    }
    getScore(state, playerId) {
        const handScore = this.handScore.getScore(state, playerId);
        const opponentScore = this.opponentScore.getScore(state, playerId);
        const playerScore = this.playerScore.getScore(state, playerId);
        const specialConditionsScore = this.specialConditionsScore.getScore(state, playerId);
        const activeScore = this.activeScore.getScore(state, playerId);
        const benchScore = this.benchScore.getScore(state, playerId);
        const energyScore = this.energyScore.getScore(state, playerId);
        const damageScore = this.damageScore.getScore(state, playerId);
        const toolsScore = this.toolsScore.getScore(state, playerId);
        const score = handScore
            + opponentScore
            + playerScore
            + specialConditionsScore
            + activeScore
            + benchScore
            + energyScore
            + damageScore
            + toolsScore;
        return score;
    }
    getCardScore(state, playerId, card) {
        const player = this.getPlayer(state, playerId);
        const index = player.hand.cards.findIndex(c => c.id === card.id);
        const baseScore = this.handScore.getScore(state, playerId);
        let afterScore = baseScore;
        // Card is not in the hand, what if we have it?
        if (index === -1) {
            player.hand.cards.push(card);
            afterScore = this.handScore.getScore(state, playerId);
            player.hand.cards.pop();
            // Card is in our hand, what if we loses it?
        }
        else {
            const c = player.hand.cards.splice(index, 1);
            afterScore = this.handScore.getScore(state, playerId);
            player.hand.cards.splice(index, 0, c[0]);
        }
        return afterScore - baseScore;
    }
    getPokemonScore(cardList) {
        return this.getPokemonScoreBy(this.options.scores.active, cardList);
    }
}
exports.StateScore = StateScore;
