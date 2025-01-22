"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RescueEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
class RescueEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TM';
        this.name = 'Rescue Energy';
        this.fullName = 'Rescue Energy TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.RESCUE_ENERGY_MAREKER = 'RESCUE_ENERGY_MAREKER';
        this.text = 'Rescue Energy provides C Energy. If the Pokemon this card is attached ' +
            'to is Knocked Out by damage from an attack, put that Pokemon back into ' +
            'your hand. (Discard all cards attached to that Pokemon.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const target = effect.target;
            const cards = target.getPokemons();
            cards.forEach(card => {
                player.marker.addMarker(this.RESCUE_ENERGY_MAREKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.discard.cards.includes(this)) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.RESCUE_ENERGY_MAREKER)) {
                    return;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.RESCUE_ENERGY_MAREKER && m.source !== undefined)
                    .map(m => m.source);
                player.discard.moveCardsTo(rescued, player.hand);
                player.marker.removeMarker(this.RESCUE_ENERGY_MAREKER);
            });
        }
        return state;
    }
}
exports.RescueEnergy = RescueEnergy;
