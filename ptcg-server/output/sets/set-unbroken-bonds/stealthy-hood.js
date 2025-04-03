"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StealthyHood = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StealthyHood extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.name = 'Stealthy Hood';
        this.fullName = 'Stealthy Hood UNB';
        this.set = 'UNB';
        this.setNumber = '186';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Prevent all effects of your opponent\'s Abilities done to the Pokémon this card is attached to. Remove any such existing effects.';
    }
    reduceEffect(store, state, effect) {
        // Prevent effects of abilities from opponent's Pokemon
        if (effect instanceof game_effects_1.EffectOfAbilityEffect && effect.target && effect.target.cards.includes(this)) {
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            effect.target = undefined;
        }
        return state;
    }
}
exports.StealthyHood = StealthyHood;
