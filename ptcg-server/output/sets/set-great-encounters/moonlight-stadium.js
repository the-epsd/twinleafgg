"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoonlightStadium = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MoonlightStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'GE';
        this.name = 'Moonlight Stadium';
        this.fullName = 'Moonlight Stadium GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.text = 'The Retreat Cost for each {P} and {D} Pokémon (both yours and your opponent\'s) is 0.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.player.active);
            store.reduceEffect(state, checkPokemonType);
            if ((checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK)) || checkPokemonType.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                effect.cost = [];
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.MoonlightStadium = MoonlightStadium;
