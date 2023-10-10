"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureBoosterEnergyCapsule = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class FutureBoosterEnergyCapsule extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.FUTURE];
        this.set = 'PAR';
        this.name = 'Future Booster Energy Capsule';
        this.fullName = 'Future Booster Energy Capsule PAR';
        this.text = 'The Future Pokémon this card is attached to has no Retreat Cost, and the attacks it uses do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (this instanceof game_1.PokemonCard && this.tags.includes(card_types_1.CardTag.FUTURE)) {
            if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
                effect.cost = [];
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.target.isActive()) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.FutureBoosterEnergyCapsule = FutureBoosterEnergyCapsule;
