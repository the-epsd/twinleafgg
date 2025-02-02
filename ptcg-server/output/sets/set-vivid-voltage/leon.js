"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leon = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Leon extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'VIV';
        this.name = 'Leon';
        this.fullName = 'Leon VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.text = 'During this turn, your Pokemon\'s attacks do 30 more damage to your ' +
            'opponent\'s Active Pokemon (before applying Weakness and Resistance).';
        this.LEON_MARKER = 'LEON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.LEON_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const marker = effect.player.marker;
            if (marker.hasMarker(this.LEON_MARKER, this) && effect.damage > 0) {
                effect.damage += 30;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.LEON_MARKER, this);
            return state;
        }
        return state;
    }
}
exports.Leon = Leon;
