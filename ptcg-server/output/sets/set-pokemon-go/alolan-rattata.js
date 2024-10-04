"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanRattata = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanRattata extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 40;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hyper Fang',
                cost: [C, C],
                damage: 50,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.name = 'Alolan Rattata';
        this.fullName = 'Alolan Rattata PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.AlolanRattata = AlolanRattata;
