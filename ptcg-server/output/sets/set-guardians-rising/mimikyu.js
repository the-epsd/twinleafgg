"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Mimikyu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Filch',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Copycat',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 0,
                copycatAttack: true,
                text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
            }];
        this.set = 'GRI';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const lastAttack = state.lastAttack;
            if (!lastAttack || lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
                return state;
            }
            const attackEffect = new game_effects_1.AttackEffect(player, opponent, lastAttack);
            store.reduceEffect(state, attackEffect);
            if (attackEffect.damage > 0) {
                const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                state = store.reduceEffect(state, dealDamage);
            }
            return state;
        }
        return state;
    }
}
exports.Mimikyu = Mimikyu;
