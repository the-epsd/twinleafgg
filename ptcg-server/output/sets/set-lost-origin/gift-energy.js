"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GiftEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '171';
        this.regulationMark = 'F';
        this.name = 'Gift Energy';
        this.fullName = 'Gift Energy LOR';
        this.GIFT_ENERGY_MARKER = 'GIFT_ENERGY_MARKER';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy. ' +
            ' ' +
            'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, draw cards until you have 7 cards in your hand.';
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
                player.marker.addMarker(this.GIFT_ENERGY_MARKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.GIFT_ENERGY_MARKER)) {
                    return;
                }
                while (player.hand.cards.length < 7) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
                player.marker.removeMarker(this.GIFT_ENERGY_MARKER);
            });
        }
        return state;
    }
}
exports.GiftEnergy = GiftEnergy;
