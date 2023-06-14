"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleScore = void 0;
const game_1 = require("../../game");
class SimpleScore {
    constructor(options) {
        this.options = options;
    }
    getPlayer(state, playerId) {
        const player = state.players.find(p => p.id === playerId);
        if (player === undefined) {
            throw new game_1.GameError(game_1.GameMessage.INVALID_GAME_STATE);
        }
        return player;
    }
    getPokemonScoreBy(scores, cardList) {
        const card = cardList.getPokemonCard();
        if (card === undefined) {
            return 0;
        }
        let damage = 0;
        card.attacks.forEach(a => damage += a.damage);
        let score = 0;
        score += scores.hp * card.hp;
        score += scores.damage * damage;
        score += scores.ability * card.powers.length;
        score += scores.retreat * card.retreat.length;
        return score;
    }
}
exports.SimpleScore = SimpleScore;
