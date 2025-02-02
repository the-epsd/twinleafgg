"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanillite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
class Vanillite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Icicle Barb',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            }];
        this.set = 'NVI';
        this.name = 'Vanillite';
        this.fullName = 'Vanillite NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    effect.damage += 10;
                }
            });
        }
        return state;
    }
}
exports.Vanillite = Vanillite;
