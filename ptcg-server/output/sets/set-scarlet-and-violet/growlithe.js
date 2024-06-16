"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Growlithe = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Growlithe extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Relentless Flames',
                cost: [game_1.CardType.FIRE],
                damage: 30,
                text: 'Flip a coin until you get tails. This attack does 30 damage for each heads.'
            }
        ];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Growlithe';
        this.fullName = 'Growlithe SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let heads = 0;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], (result) => {
                let flipResult = result[0];
                while (flipResult) {
                    heads++;
                    state = store.prompt(state, [
                        new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                    ], (newResult) => {
                        flipResult = newResult[0];
                    });
                }
                effect.damage = heads * 30;
                return state;
            });
        }
        return state;
    }
}
exports.Growlithe = Growlithe;
