"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nincada = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
// LOT Nincada 29 (https://limitlesstcg.com/cards/LOT/29)
class Nincada extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Fury Swipes', cost: [card_types_1.CardType.COLORLESS], damage: 10, text: 'Flip 3 coins. This attack does 10 damage for each heads.' },
        ];
        this.set = 'LOT';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nincada';
        this.fullName = 'Nincada LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Nincada = Nincada;
