"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zacian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zacian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Battle Legion',
                cost: [card_types_1.CardType.METAL],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each of your Benched Pokémon. This attack\'s damage '
                    + 'isn\'t affected by Weakness or by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Slicing Blade',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }];
        this.set = 'CRZ';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Zacian';
        this.fullName = 'Zacian CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            //Get number of benched pokemon
            const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = playerBenched;
            const damage = 20 + (totalBenched * 10);
            effect.damage = 0;
            effect.ignoreWeakness = true;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Zacian = Zacian;
