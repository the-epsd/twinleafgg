"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseAbilityTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class UseAbilityTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        let bestScore = this.getStateScore(state, player.id);
        let useAbilityAction;
        const passTurnScore = this.options.scores.tactics.passTurn;
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            for (const power of card.powers) {
                if (power.useWhenInPlay) {
                    const action = new game_1.UseAbilityAction(player.id, power.name, target);
                    const score = this.evaluateAction(state, player.id, action, passTurnScore);
                    if (score !== undefined && bestScore < score) {
                        bestScore = score;
                        useAbilityAction = action;
                    }
                }
            }
        });
        return useAbilityAction;
    }
}
exports.UseAbilityTactic = UseAbilityTactic;
