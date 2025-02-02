"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlusPower = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class PlusPower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BLW';
        this.name = 'PlusPower';
        this.fullName = 'PlusPower BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.text = 'During this turn, your Pokemon\'s attacks do 10 more damage to the ' +
            'Active Pokemon (before applying Weakness and Resistance).';
        this.PLUS_POWER_MARKER = 'PLUS_POWER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.PLUS_POWER_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const marker = effect.player.marker;
            if (marker.hasMarker(this.PLUS_POWER_MARKER, this) && effect.damage > 0) {
                effect.damage += 10;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.PLUS_POWER_MARKER, this);
        }
        return state;
    }
}
exports.PlusPower = PlusPower;
