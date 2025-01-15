"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureBoosterEnergyCapsule = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class FutureBoosterEnergyCapsule extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.FUTURE];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '164';
        this.set = 'PAR';
        this.name = 'Future Booster Energy Capsule';
        this.fullName = 'Future Booster Energy Capsule PAR';
        this.text = 'The Future Pokémon this card is attached to has no Retreat Cost, and the attacks it uses do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.active.tool === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            if (effect.player.active.futurePokemon()) {
                effect.damage += 20;
            }
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            if (effect.player.active.futurePokemon()) {
                effect.cost = [];
            }
            return state;
        }
        return state;
    }
}
exports.FutureBoosterEnergyCapsule = FutureBoosterEnergyCapsule;
