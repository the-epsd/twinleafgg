"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Karen = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Karen extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'XYP';
        this.name = 'Karen';
        this.fullName = 'Karen PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'XY177';
        this.text = 'Each player shuffles all Pokémon in his or her discard pile into his or her deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            for (const p of [effect.player, state_utils_1.StateUtils.getOpponent(state, effect.player)]) {
                const discardedPokemon = p.discard.cards.filter(c => c instanceof game_1.PokemonCard);
                prefabs_1.SHUFFLE_CARDS_INTO_DECK(store, state, p, discardedPokemon);
            }
        }
        return state;
    }
}
exports.Karen = Karen;
