"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrozenCity = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class FrozenCity extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PLF';
        this.name = 'Frozen City';
        this.fullName = 'Frozen City PLF';
        this.text = 'Whenever any player attaches an Energy from his or her hand to 1 of his or her Pokémon (excluding Team Plasma Pokémon), put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            store.log(state, game_1.GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, { name: owner.name, damage: 20, target: effect.target.getPokemonCard().name, effect: this.name });
            effect.target.damage += 20;
            return state;
        }
        return state;
    }
}
exports.FrozenCity = FrozenCity;
