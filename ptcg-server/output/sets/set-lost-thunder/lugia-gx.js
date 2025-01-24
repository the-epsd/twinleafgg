"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LugiaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
// CIN Lugia-GX 57 (https://limitlesstcg.com/cards/CIN/57)
class LugiaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Psychic', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 30, text: 'This attack does 30 more damage times the amount of Energy attached to your opponent\'s Active Pokémon. ' },
            { name: 'Pelagic Blade', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 170, text: 'This Pokémon can\'t attack during your next turn.' },
            { name: 'Lost Purge-GX', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 0, text: 'Put your opponent\'s Active Pokémon and all cards attached to it in the Lost Zone. (You can\'t use more than 1 GX attack in a game.)' }
        ];
        this.set = 'SUM';
        this.setNumber = '159';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lugia-GX';
        this.fullName = 'Lugia-GX LOT';
        // for preventing the pokemon from attacking on the next turn
        this.PELAGIC_BLADE_MARKER = 'PELAGIC_BLADE_MARKER';
        this.PELAGIC_BLADE_2_MARKER = 'PELAGIC_BLADE_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Psychic
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 30;
        }
        // Pelagic Blade
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check marker
            if (player.marker.hasMarker(this.PELAGIC_BLADE_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.marker.addMarker(this.PELAGIC_BLADE_MARKER, this);
            console.log('marker added');
        }
        // Lost Purge-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            opponent.active.moveTo(opponent.lostzone);
            opponent.active.clearEffects();
        }
        // removing the markers for preventing the pokemon from attacking
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.PELAGIC_BLADE_2_MARKER, this)) {
                player.marker.removeMarker(this.PELAGIC_BLADE_MARKER, this);
                player.marker.removeMarker(this.PELAGIC_BLADE_2_MARKER, this);
                console.log('marker cleared');
            }
            if (player.marker.hasMarker(this.PELAGIC_BLADE_MARKER, this)) {
                player.marker.addMarker(this.PELAGIC_BLADE_2_MARKER, this);
                console.log('second marker added');
            }
        }
        return state;
    }
}
exports.LugiaGX = LugiaGX;
