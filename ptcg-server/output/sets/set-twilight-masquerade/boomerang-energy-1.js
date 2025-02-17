"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoomerangEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class BoomerangEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.regulationMark = 'H';
        this.name = 'Boomerang Energy';
        this.fullName = 'Boomerang Energy TWM';
        this.text = `As long as this card is attached to a Pokémon, it provides [C] Energy.
    
  If this card is discarded by an effect of an attack used by the Pokémon this card is attached to, attach this card from your discard pile to that Pokémon after attacking.`;
        this.BOOMERANG_EXISTANCE_MARKER = 'BOOMERANG_EXISTANCE_MARKER';
        this.BOOMERANG_DISCARDED_MARKER = 'BOOMERANG_DISCARDED_MARKER';
    }
    reduceEffect(store, state, effect) {
        // checking if this is on the player's active when attacking
        if (effect instanceof game_effects_1.AttackEffect && effect.source.cards.includes(this)) {
            effect.player.marker.addMarker(this.BOOMERANG_EXISTANCE_MARKER, this);
        }
        // checking if this card is discarded while attacking
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.player.marker.hasMarker(this.BOOMERANG_EXISTANCE_MARKER, this)) {
            effect.player.marker.addMarker(this.BOOMERANG_DISCARDED_MARKER, this);
        }
        // removing the markers and handling the reattaching of it
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BOOMERANG_EXISTANCE_MARKER, this)) {
            effect.player.marker.removeMarker(this.BOOMERANG_EXISTANCE_MARKER, this);
            // if this card was in the discard and triggered that earlier part, move it onto the acitve
            if (effect.player.marker.hasMarker(this.BOOMERANG_DISCARDED_MARKER, this)) {
                effect.player.marker.removeMarker(this.BOOMERANG_DISCARDED_MARKER, this);
                if (effect.player.active !== undefined) {
                    effect.player.discard.cards.forEach(card => {
                        if (card === this) {
                            effect.player.discard.moveCardTo(card, effect.player.active);
                        }
                    });
                }
            }
        }
        return state;
    }
}
exports.BoomerangEnergy = BoomerangEnergy;
