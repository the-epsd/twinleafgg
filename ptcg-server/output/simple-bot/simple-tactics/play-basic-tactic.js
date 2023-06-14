"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayBasicTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class PlayBasicTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        const basicPokemon = player.hand.cards
            .find(c => c instanceof game_1.PokemonCard && c.stage === game_1.Stage.BASIC);
        const emptyBenchSlot = player.bench
            .find(b => b.cards.length === 0);
        if (basicPokemon && emptyBenchSlot) {
            return new game_1.PlayCardAction(player.id, player.hand.cards.indexOf(basicPokemon), this.getCardTarget(player, state, emptyBenchSlot));
        }
    }
}
exports.PlayBasicTactic = PlayBasicTactic;
