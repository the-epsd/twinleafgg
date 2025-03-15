"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachToolTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class AttachToolTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        const tools = player.hand.cards.filter(c => {
            return c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.TOOL;
        });
        if (tools.length === 0) {
            return;
        }
        const tool = tools[0];
        const baseScore = this.getStateScore(state, player.id);
        const targets = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, pokemon, target) => {
            if (cardList.tool !== undefined) {
                return;
            }
            cardList.tool = tool;
            const score = this.getStateScore(state, player.id);
            cardList.tool = undefined;
            if (score > baseScore) {
                targets.push({ target, score });
            }
        });
        if (targets.length === 0) {
            return;
        }
        targets.sort((a, b) => b.score - a.score);
        const target = targets[0].target;
        const index = player.hand.cards.indexOf(tools[0]);
        return new game_1.PlayCardAction(player.id, index, target);
    }
}
exports.AttachToolTactic = AttachToolTactic;
