"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jynx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Jynx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Jynx';
        this.set = 'BS';
        this.fullName = 'Jynx BS';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Doubleslap',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Meditate',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Does 20 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
            ], (results) => {
                const heads = results.filter(r => r).length;
                effect.damage = heads * 10;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const damage = opponent.active.damage + 20;
            effect.damage = damage;
        }
        return state;
    }
}
exports.Jynx = Jynx;
