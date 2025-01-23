"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowbro = void 0;
const game_1 = require("../../game");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Slowbro extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Yawn',
                cost: [W],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            },
            {
                name: 'Three Strikes',
                cost: [W, C, C],
                damage: 100,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 100 damage for each heads. If all of them are tails, you lose this game.'
            }
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Slowbro';
        this.fullName = 'Slowbro UNB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.ASLEEP]);
            state = store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                if (heads === 0) {
                    for (let i = 0; i < state.players.length; i++) {
                        const currentPlayer = state.players[i];
                        if (currentPlayer.id === player.id) {
                            state.winner = currentPlayer.id === game_1.GameWinner.PLAYER_1 ? game_1.GameWinner.PLAYER_2 : game_1.GameWinner.PLAYER_1;
                            state = check_effect_1.endGame(store, state, state.winner);
                            return;
                        }
                    }
                }
                effect.damage = heads * 100;
            });
        }
        return state;
    }
}
exports.Slowbro = Slowbro;
