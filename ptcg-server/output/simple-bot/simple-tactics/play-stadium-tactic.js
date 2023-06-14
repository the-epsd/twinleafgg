"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayStadiumTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class PlayStadiumTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        // Don't discard your own stadium cards
        if (player.stadiumPlayedTurn >= state.turn || player.stadium.cards.length > 0) {
            return;
        }
        let stadiums = player.hand.cards.filter(c => {
            return c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.STADIUM;
        });
        // Don't play stadiums of the same name as current stadium
        const currentStadium = game_1.StateUtils.getStadiumCard(state);
        if (currentStadium) {
            stadiums = stadiums.filter(c => c.fullName !== currentStadium.fullName);
        }
        if (stadiums.length === 0) {
            return;
        }
        const index = player.hand.cards.indexOf(stadiums[0]);
        const target = { player: game_1.PlayerType.ANY, slot: game_1.SlotType.BOARD, index: 0 };
        return new game_1.PlayCardAction(player.id, index, target);
    }
}
exports.PlayStadiumTactic = PlayStadiumTactic;
