"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purrloin = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Purrloin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.DARK;
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Surprise Attack',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Purrloin';
        this.fullName = 'Purrloin BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Purrloin = Purrloin;
