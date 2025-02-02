"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
class Riolu2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Punch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }, {
                name: 'Quick Attack',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }];
        this.set = 'LTR';
        this.name = 'Riolu';
        this.fullName = 'Riolu LT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.Riolu2 = Riolu2;
