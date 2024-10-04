"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Sudowoodo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Watch and Learn',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If your opponent\'s Pokémon used an attack during his or her last turn, use it as this attack.'
            }];
        this.set = 'BKP';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo BKP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const lastAttack = state.lastAttack;
            if (!lastAttack || lastAttack.name === 'Copycat' || lastAttack.name === 'Watch and Learn') {
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
exports.Sudowoodo = Sudowoodo;
