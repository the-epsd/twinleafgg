"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachEnergyTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
const energy_score_1 = require("../state-score/energy-score");
class AttachEnergyTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        if (player.energyPlayedTurn >= state.turn) {
            return undefined;
        }
        // Distinct list with player's energies.
        const energies = [];
        player.hand.cards.forEach(c => {
            if (c instanceof game_1.EnergyCard && !energies.some(e => e.fullName === c.fullName)) {
                energies.push(c);
            }
        });
        if (energies.length === 0) {
            return;
        }
        const energyScore = new energy_score_1.EnergyScore(this.options);
        const baseScore = energyScore.getScore(state, player.id);
        const targets = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, pokemon, target) => {
            for (const card of energies) {
                cardList.cards.push(card);
                const score = energyScore.getScore(state, player.id);
                cardList.cards.pop();
                if (score > baseScore) {
                    targets.push({ target, score, card });
                }
            }
        });
        if (targets.length === 0) {
            return;
        }
        targets.sort((a, b) => b.score - a.score);
        const target = targets[0].target;
        const index = player.hand.cards.indexOf(targets[0].card);
        return new game_1.PlayCardAction(player.id, index, target);
    }
}
exports.AttachEnergyTactic = AttachEnergyTactic;
