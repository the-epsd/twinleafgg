"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprigatito = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sprigatito extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Stomp Repeatedly',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 10 damage for each heads.'
            }];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Sprigatito';
        this.fullName = 'Sprigatito SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Sprigatito = Sprigatito;
