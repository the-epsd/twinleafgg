"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscapeBoard = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class EscapeBoard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UPR';
        this.name = 'Escape Board';
        this.fullName = 'Escape Board UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.text = 'The Retreat Cost of the Pokémon this card is attached to is [C] less, and it can retreat even if it\'s Asleep or Paralyzed.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            if (effect.cost.length === 0) {
                effect.cost = [];
            }
            else {
                effect.cost.splice(0, 1);
            }
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.tool === this) {
            effect.ignoreStatusConditions = true;
            effect.player.active.clearEffects();
        }
        return state;
    }
}
exports.EscapeBoard = EscapeBoard;
