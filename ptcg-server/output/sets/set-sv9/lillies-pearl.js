"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesPearl = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LilliesPearl extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Lillie\'s Pearl';
        this.fullName = 'Lillie\'s Pearl SV9';
        this.text = 'If the Lillie\'s Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card.';
    }
    // public damageDealt = false;
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            if (effect.target.isLillies()) {
                effect.prizeCount -= 1;
            }
            return state;
        }
        return state;
    }
}
exports.LilliesPearl = LilliesPearl;
