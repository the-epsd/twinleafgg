"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialgaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DialgaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Overclock',
                cost: [M],
                damage: 0,
                text: 'Draw cards until you have 6 cards in your hand.'
            },
            {
                name: 'Shred',
                cost: [M, C, C],
                damage: 80,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Timeless-GX',
                cost: [M, M, M, C, C],
                damage: 150,
                gxAttack: true,
                text: 'Take another turn after this one. (Skip the between-turns step.) (You can\'t use more than 1 GX attack in a game.) '
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Dialga-GX';
        this.fullName = 'Dialga-GX UPR';
        this.TIMELESS_GX_MARKER = 'TIMELESS_GX_MARKER';
        this.TIMELESS_GX_MARKER_2 = 'TIMELESS_GX_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.TIMELESS_GX_MARKER_2, this)) {
            effect.player.marker.removeMarker(this.TIMELESS_GX_MARKER, this);
            effect.player.marker.removeMarker(this.TIMELESS_GX_MARKER_2, this);
            effect.player.usedTurnSkip = false;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.TIMELESS_GX_MARKER, this)) {
            effect.player.marker.addMarker(this.TIMELESS_GX_MARKER_2, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            while (player.hand.cards.length < 6) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 80);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            player.marker.addMarker(this.TIMELESS_GX_MARKER, this);
            effect.player.usedTurnSkip = true;
        }
        return state;
    }
}
exports.DialgaGX = DialgaGX;
