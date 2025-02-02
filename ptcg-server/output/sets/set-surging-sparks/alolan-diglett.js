"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanDiglett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanDiglett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Surprise Attack',
                cost: [],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '122';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Alolan Diglett';
        this.fullName = 'Alolan Diglett SSP';
    }
    reduceEffect(store, state, effect) {
        // Surprise Attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.AlolanDiglett = AlolanDiglett;
