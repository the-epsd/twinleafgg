"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaxly = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Quaxly extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Aerial Ace',
                cost: [W],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage. '
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Quaxly';
        this.fullName = 'Quaxly SSP';
    }
    reduceEffect(store, state, effect) {
        // Aerial Ace
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.Quaxly = Quaxly;
