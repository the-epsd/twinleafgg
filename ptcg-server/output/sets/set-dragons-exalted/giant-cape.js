"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiantCape = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GiantCape extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DRX';
        this.name = 'Giant Cape';
        this.fullName = 'Giant Cape DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.text = 'The Pokémon this card is attached to gets +20 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            effect.hp += 20;
        }
        return state;
    }
}
exports.GiantCape = GiantCape;
