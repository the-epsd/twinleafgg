"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class Pikachu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: 2 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            },
            {
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'BWP';
        this.fullName = 'Pikachu BWP';
        this.name = 'Pikachu';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (heads) {
                    effect.damage += 10;
                }
            });
        }
        if (effect.attack === this.attacks[1]) {
            // No additional effects for Electro Ball
        }
        return state;
    }
}
exports.Pikachu = Pikachu;
