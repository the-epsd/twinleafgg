"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectionCube = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ProtectionCube extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.TOOL;
        this.set = 'FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Protection Cube';
        this.fullName = 'Protection Cube FLF';
        this.text = 'Prevent all damage done to the Pokémon this card is attached to by attacks it uses.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source == effect.player.active && effect.source.cards.includes(this)) {
            if (effect.target == effect.source) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.ProtectionCube = ProtectionCube;
