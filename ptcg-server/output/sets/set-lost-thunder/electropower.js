"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electropower = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Electropower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '172';
        this.name = 'Electropower';
        this.fullName = 'Electropower LOT';
        this.text = 'During this turn, your [L] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
        this.ELECTROPOWER_MARKER = 'ELECTROPOWER_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.ELECTROPOWER_MARKER, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.LIGHTNING) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.ELECTROPOWER_MARKER, this) && effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 30;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.ELECTROPOWER_MARKER, this);
        }
        return state;
    }
}
exports.Electropower = Electropower;
