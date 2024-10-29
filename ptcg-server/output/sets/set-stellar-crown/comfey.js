"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comfey = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Comfey extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flower Shower',
                cost: [game_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Each player draws 3 cards.'
            },
            {
                name: 'Play Rough',
                cost: [game_1.CardType.PSYCHIC],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Comfey';
        this.fullName = 'Comfey SV7';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (opponent.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            player.deck.moveTo(player.hand, 3);
            opponent.deck.moveTo(opponent.hand, 3);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.Comfey = Comfey;
