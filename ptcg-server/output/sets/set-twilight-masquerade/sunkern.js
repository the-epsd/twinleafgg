"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunkern = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sunkern extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bullet Seed',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                damageCalculation: 'x',
                text: ' Flip 4 coins. This attack does 10 damage for each heads. '
            }
        ];
        this.set = 'TWM';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Sunkern TWM';
        this.name = 'Sunkern';
        this.setNumber = '6';
    }
    reduceEffect(store, state, effect) {
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
                effect.damage = 10 * heads;
            });
            return state;
        }
        return state;
    }
}
exports.Sunkern = Sunkern;
