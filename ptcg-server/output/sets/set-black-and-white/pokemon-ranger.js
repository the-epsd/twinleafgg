"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonRanger = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class PokemonRanger extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'STS';
        this.name = 'Pokemon Ranger';
        this.fullName = 'Pokemon Ranger STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.text = 'Remove all effects of attacks on each player and his' +
            'or her Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const topPlayer = state.players[game_1.PlayerType.TOP_PLAYER];
            const bottomPlayer = state.players[game_1.PlayerType.BOTTOM_PLAYER];
            topPlayer.active.clearEffects();
            topPlayer.bench.forEach(b => b.clearEffects());
            topPlayer.removePokemonEffects(topPlayer.active);
            topPlayer.bench.forEach(b => topPlayer.removePokemonEffects(b));
            bottomPlayer.active.clearEffects();
            bottomPlayer.bench.forEach(b => b.clearEffects());
            bottomPlayer.removePokemonEffects(bottomPlayer.active);
            bottomPlayer.bench.forEach(b => bottomPlayer.removePokemonEffects(b));
            return state;
        }
        return state;
    }
}
exports.PokemonRanger = PokemonRanger;
