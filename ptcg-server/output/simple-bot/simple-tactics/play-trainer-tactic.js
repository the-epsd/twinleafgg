"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayTrainerTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class PlayTrainerTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        const trainers = player.hand.cards.filter(c => {
            return c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.ITEM;
        });
        if (trainers.length === 0) {
            return;
        }
        const target = { player: game_1.PlayerType.ANY, slot: game_1.SlotType.BOARD, index: 0 };
        let bestScore = this.getStateScore(state, player.id);
        let playCardAction;
        trainers.forEach(card => {
            const index = player.hand.cards.indexOf(card);
            const action = new game_1.PlayCardAction(player.id, index, target);
            const score = this.evaluateAction(state, player.id, action);
            if (score !== undefined && bestScore < score) {
                bestScore = score;
                playCardAction = action;
            }
        });
        return playCardAction;
    }
}
exports.PlayTrainerTactic = PlayTrainerTactic;
