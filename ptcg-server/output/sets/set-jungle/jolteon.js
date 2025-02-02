"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jolteon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.evolvesFrom = 'Eevee';
        this.attacks = [{
                name: 'Quick Attack',
                cost: [C, C],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 damage.'
            },
            {
                name: 'Pin Missile',
                cost: [L, L, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Jolteon';
        this.fullName = 'Jolteon JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    effect.damage += 20;
                }
                else {
                    effect.damage += 10;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 20 * heads;
            });
            return state;
        }
        return state;
    }
}
exports.Jolteon = Jolteon;
