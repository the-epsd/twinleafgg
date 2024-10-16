"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buzzwole = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
// FCI Buzzwole 77 (https://limitlesstcg.com/cards/FLI/77)
class Buzzwole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Sledgehammer', cost: [card_types_1.CardType.FIGHTING], damage: 30, text: 'If your opponent has exactly 4 Prize cards remaining, this attack does 90 more damage.' },
            { name: 'Swing Around', cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS], damage: 80, text: 'Flip 2 coins. This attack does 20 more damage for each heads.' }
        ];
        this.set = 'FLI';
        this.name = 'Buzzwole';
        this.fullName = 'Buzzwole FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() === 4) {
                effect.damage += 90;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 20 * heads;
            });
        }
        return state;
    }
}
exports.Buzzwole = Buzzwole;
