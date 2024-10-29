"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scorbunny = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Scorbunny extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Quick Attack',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            }];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Scorbunny';
        this.fullName = 'Scorbunny SV7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    effect.damage += 10;
                }
            });
        }
        return state;
    }
}
exports.Scorbunny = Scorbunny;
