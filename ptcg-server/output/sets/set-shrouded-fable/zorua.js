"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zorua = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Zorua extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Stampede',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Double Scratch',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage for each heads.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Zorua';
        this.fullName = 'Zorua SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
            ], (results) => {
                const heads = results.filter(r => !!r).length;
                effect.damage = heads * 20;
            });
        }
        return state;
    }
}
exports.Zorua = Zorua;
