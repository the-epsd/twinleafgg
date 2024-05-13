"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostCity = void 0;
const state_1 = require("../../game/store/state/state");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class LostCity extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '161';
        this.name = 'Lost City';
        this.fullName = 'Lost City LOR';
        this.text = 'Whenever a Pokémon (either yours or your opponent\'s) is Knocked Out, put that Pokémon in the Lost Zone instead of the discard pile. (Discard all attached cards.)';
        this.LOST_CITY_MARKER = 'LOST_CITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const target = effect.target;
            const cards = target.getPokemons();
            cards.forEach(card => {
                player.marker.addMarker(this.LOST_CITY_MARKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.LOST_CITY_MARKER)) {
                    return;
                }
                const lostZoned = player.marker.markers
                    .filter(m => m.name === this.LOST_CITY_MARKER)
                    .map(m => m.source);
                player.discard.moveCardsTo(lostZoned, player.lostzone);
                player.marker.removeMarker(this.LOST_CITY_MARKER);
            });
        }
        return state;
    }
}
exports.LostCity = LostCity;
