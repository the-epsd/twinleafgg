"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefianceBand = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class DefianceBand extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'Defiance Band';
        this.fullName = 'Defiance Band SVI';
        this.text = 'If you have more Prize cards remaining than your opponent, the attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
        this.DEFIANCE_BAND_MARKER = 'DEFIANCE_BAND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                return state;
            }
            player.marker.addMarker(this.DEFIANCE_BAND_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const marker = effect.player.marker;
            if (marker.hasMarker(this.DEFIANCE_BAND_MARKER, this) && effect.damage > 0) {
                effect.damage += 30;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.DEFIANCE_BAND_MARKER, this);
        }
        return state;
    }
}
exports.DefianceBand = DefianceBand;
