"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Swords Dance',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'During your next turn, Scyther\'s Slash attack\'s base damage is 60 instead of 30.'
            },
            {
                name: 'Slash',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Scyther';
        this.fullName = 'Scyther JU';
        this.SWORDS_DANCE_MARKER = 'SWORDS_DANCE_MARKER';
        this.CLEAR_SWORDS_DANCE_MARKER = 'CLEAR_SWORDS_DANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Handle Swords Dance (first attack)
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Add markers for Swords Dance
            player.active.marker.addMarker(this.SWORDS_DANCE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_SWORDS_DANCE_MARKER, this);
            return state;
        }
        // Handle Slash (second attack)
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (effect.player.active.marker.hasMarker(this.SWORDS_DANCE_MARKER, this)) {
                effect.damage += 30;
            }
            return state;
        }
        // Handle end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_SWORDS_DANCE_MARKER, this)) {
            // Remove the clear marker from opponent
            effect.player.marker.removeMarker(this.CLEAR_SWORDS_DANCE_MARKER, this);
            // Remove Swords Dance marker from all of opponent's opponent's (original player's) Pokemon
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.SWORDS_DANCE_MARKER, this);
            });
            return state;
        }
        return state;
    }
}
exports.Scyther = Scyther;
