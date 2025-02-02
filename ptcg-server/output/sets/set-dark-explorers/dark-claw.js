"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkClaw = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DarkClaw extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DEX';
        this.name = 'Dark Claw';
        this.fullName = 'Dark Claw DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.text = 'If this card is attached to a D Pokemon, each of the attacks ' +
            'of that Pokemon does 20 more damage to the Active Pokemon ' +
            '(before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.tool === this) {
            const opponent = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Not active Pokemon
            if (opponent.active !== effect.target) {
                return state;
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.DARK)) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.DarkClaw = DarkClaw;
