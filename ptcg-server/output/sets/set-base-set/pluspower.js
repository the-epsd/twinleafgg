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
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'PlusPower';
        this.fullName = 'PlusPower BS';
        this.text = 'Attach PlusPower to your Active Pokémon. At the end of your turn, discard PlusPower. If this Pokémon\'s attack does damage to the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage to the Defending Pokémon.';
        this.PLUS_POWER_MARKER = 'PLUS_POWER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.PLUS_POWER_MARKER, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const marker = effect.player.marker;
            if (marker.hasMarker(this.PLUS_POWER_MARKER, this) && effect.damage > 0) {
                effect.damage += 10;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.PLUS_POWER_MARKER, this)) {
            effect.player.marker.removeMarker(this.PLUS_POWER_MARKER, this);
        }
        return state;
    }
}
exports.PlusPower = PlusPower;
