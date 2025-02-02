"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miraidonex = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_types_2 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Miraidonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.FUTURE, card_types_2.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 220;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Repulsion Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC],
                damage: 60,
                damageCalculator: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 100 more damage.'
            },
            {
                name: 'Cyber Drive',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t use Cyber Drive.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.name = 'Miraidon ex';
        this.fullName = 'Miraidon ex TEF';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 100;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        return state;
    }
}
exports.Miraidonex = Miraidonex;
