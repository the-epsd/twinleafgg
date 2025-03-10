"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eviolite = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Eviolite extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'NVI';
        this.name = 'Eviolite';
        this.fullName = 'Eviolite NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.text = 'If the Pokemon this card is attached to is a Basic Pokemon, ' +
            'any damage done to this Pokemon by attacks is reduced by 20 ' +
            '(after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (effect.target.tools.includes(this) && effect.target.isStage(card_types_1.Stage.BASIC)) {
                effect.damage -= 20;
            }
        }
        return state;
    }
}
exports.Eviolite = Eviolite;
