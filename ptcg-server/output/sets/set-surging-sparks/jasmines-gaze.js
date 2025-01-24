"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JasminesGaze = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class JasminesGaze extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SSP';
        this.setNumber = '178';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Jasmine\'s Gaze';
        this.fullName = 'Jasmine\'s Gaze SSP';
        this.text = 'During your opponent\'s next turn, all of your Pokemon take 30 less damage ' +
            'from attacks from your opponent\'s Pokemon (after applying Weakness and Resistance). ' +
            '(This includes new Pokemon that come into play.)';
        this.JASMINES_GAZE_MARKER = 'JASMINES_GAZE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            effect.player.marker.addMarker(this.JASMINES_GAZE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = state_utils_1.StateUtils.findOwner(state, state_utils_1.StateUtils.findCardList(state, this));
            const hasMarker = player.marker.hasMarker(this.JASMINES_GAZE_MARKER, this);
            if (hasMarker) {
                effect.damage -= 30;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            state_utils_1.StateUtils.getOpponent(state, effect.player).marker.removeMarker(this.JASMINES_GAZE_MARKER);
        }
        return state;
    }
}
exports.JasminesGaze = JasminesGaze;
