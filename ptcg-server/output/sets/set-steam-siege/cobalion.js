"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cobalion = void 0;
/* eslint-disable indent */
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cobalion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Quick Guard',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                text: 'Prevent all damage done to this Pokémon by attacks from Basic Pokémon during your opponent\'s next turn. This Pokémon can\'t use Quick Guard during your next turn.',
            },
            {
                name: 'Revenge Blast',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Prize card your opponent has taken.',
            },
        ];
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Cobalion';
        this.fullName = 'Cobalion STS';
        this.QUICK_GUARD_MARKER = 'QUICK_GUARD_MARKER';
        this.CLEAR_QUICK_GUARD_MARKER = 'CLEAR_QUICK_GUARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.QUICK_GUARD_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_QUICK_GUARD_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.QUICK_GUARD_MARKER)) {
            const card = effect.source.getPokemonCard();
            const stage = card !== undefined ? card.stage : undefined;
            if (stage === card_types_1.Stage.BASIC) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.CLEAR_QUICK_GUARD_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_QUICK_GUARD_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.QUICK_GUARD_MARKER, this);
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            effect.damage += prizesTaken * 30;
        }
        return state;
    }
}
exports.Cobalion = Cobalion;
