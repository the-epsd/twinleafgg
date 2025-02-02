"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prinplup = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Prinplup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Piplup';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Razor Wing',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Fury Attack',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
            }
        ];
        this.set = 'DEX';
        this.name = 'Prinplup';
        this.fullName = 'Prinplup DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 30 * heads;
            });
        }
        return state;
    }
}
exports.Prinplup = Prinplup;
