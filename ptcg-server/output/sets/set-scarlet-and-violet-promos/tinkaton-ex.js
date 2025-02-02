"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinkatonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// PAL Tinkaton ex 262 (https://limitlesstcg.com/cards/PAL/262)
class Tinkatonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tinkatuff';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 300;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Big Hammer',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 damage for each card in your hand.'
            },
            {
                name: 'Pulverizing Press',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 140,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'SVP';
        this.name = 'Tinkaton ex';
        this.fullName = 'Tinkaton ex SVP';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
    }
    reduceEffect(store, state, effect) {
        // Big Hammer
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            effect.damage = player.hand.cards.length * 30;
        }
        // Pulverizing Press
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 140);
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
        return state;
    }
}
exports.Tinkatonex = Tinkatonex;
