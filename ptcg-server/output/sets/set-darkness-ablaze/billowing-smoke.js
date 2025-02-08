"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillowingSmoke = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class BillowingSmoke extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Billowing Smoke';
        this.fullName = 'Billowing Smoke DAA';
        this.text = 'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, ' +
            'that player discards any Prize cards they would take for that Knock Out instead of putting those cards into their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect &&
            effect.target.cards.includes(this) &&
            effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            // Set the knockout effect's prize destination to the opponent's discard pile.
            effect.prizeDestination = opponent.discard;
            return state;
        }
        return state;
    }
}
exports.BillowingSmoke = BillowingSmoke;
