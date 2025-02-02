"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gyaradosex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gyaradosex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magikarp';
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.cardType = game_1.CardType.WATER;
        this.hp = 300;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Waterfall',
                cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.WATER],
                damage: 100,
                text: ''
            },
            {
                name: 'Tyrannical Tail',
                cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 180,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 180 more damage.'
            },
        ];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Gyarados ex';
        this.fullName = 'Gyarados ex SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 180;
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Gyaradosex = Gyaradosex;
