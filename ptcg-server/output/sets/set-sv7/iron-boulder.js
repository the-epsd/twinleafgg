"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronBoulder = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class IronBoulder extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 140;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Adjusted Horn',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 170,
                text: 'If you don\'t have the same number of cards in your hand as your opponent, this attack does nothing.'
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Iron Boulder';
        this.fullName = 'Iron Boulder SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.hand.cards.length !== opponent.hand.cards.length) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.IronBoulder = IronBoulder;
