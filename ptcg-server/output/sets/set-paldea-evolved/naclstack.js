"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Naclstack = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Naclstack extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nacli';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Salt Cannon',
                cost: [F, F],
                damage: 60,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 60 damage for each heads.'
            }];
        this.set = 'PAL';
        this.name = 'Naclstack';
        this.fullName = 'Naclstack PAL';
        this.setNumber = '122';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Salt Cannon
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 60 * heads;
            });
        }
        return state;
    }
}
exports.Naclstack = Naclstack;
