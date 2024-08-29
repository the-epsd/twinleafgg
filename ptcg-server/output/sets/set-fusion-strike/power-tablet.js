"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerTablet = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class PowerTablet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'FST';
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '236';
        this.regulationMark = 'E';
        this.name = 'Power Tablet';
        this.fullName = 'Power Tablet FST';
        this.text = 'During this turn, your Fusion Strike Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
        this.POWER_TABLET_MARKER = 'POWER_TABLET_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.POWER_TABLET_MARKER, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.FUSION_STRIKE))) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.POWER_TABLET_MARKER, this) && effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 30;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.POWER_TABLET_MARKER, this);
        }
        return state;
    }
}
exports.PowerTablet = PowerTablet;
