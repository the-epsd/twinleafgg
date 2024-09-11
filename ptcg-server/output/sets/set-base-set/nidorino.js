"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidorino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Nidorino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Nidorino';
        this.set = 'BS';
        this.fullName = 'Nidorino BS';
        this.cardType = card_types_1.CardType.GRASS;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nidoran M';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Double Kick',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Horn Drill',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
            ], (results) => {
                const heads = results.filter(r => !!r).length;
                effect.damage = heads * 30;
            });
        }
        return state;
    }
}
exports.Nidorino = Nidorino;
