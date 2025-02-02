"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanicMask = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
class PanicMask extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Panic Mask';
        this.fullName = 'Panic Mask LOR';
        this.text = 'Prevent all damage done to the Pokémon this card is attached to by attacks from your opponent\'s Pokémon that have 40 HP or less remaining.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            const attackingPokemon = player.active;
            const maxHp = ((_a = attackingPokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.hp) || 0;
            const currentHp = maxHp - attackingPokemon.damage;
            if (currentHp <= 40) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.PanicMask = PanicMask;
