"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupereffectiveGlasses = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SupereffectiveGlasses extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.TOOL;
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.regulationMark = 'F';
        this.name = 'Supereffective Glasses';
        this.fullName = 'Supereffective Glasses ASR';
        this.text = 'When applying Weakness to damage from the attacks of the Pokémon this card is attached to done to your opponent\'s Active Pokémon, apply it as ×3.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.ApplyWeaknessEffect && effect.target.tool === this) {
            effect.damage = effect.damage * 1.5;
        }
        return state;
    }
}
exports.SupereffectiveGlasses = SupereffectiveGlasses;
