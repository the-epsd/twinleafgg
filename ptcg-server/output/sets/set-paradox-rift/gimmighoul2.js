"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gimmighoul2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gimmighoul2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Continuous Coin Toss',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Gimmighoul';
        this.fullName = 'Gimmighoul2 PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let heads = 0;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    heads++;
                    return this.reduceEffect(store, state, effect);
                }
                effect.damage = heads * 20;
            });
        }
        return state;
    }
}
exports.Gimmighoul2 = Gimmighoul2;
