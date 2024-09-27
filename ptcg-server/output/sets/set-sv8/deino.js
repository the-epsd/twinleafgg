"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deino = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Deino extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Stomp Off',
                cost: [D],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Bite',
                cost: [D, C],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Deino';
        this.fullName = 'Deino SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 1);
        }
        return state;
    }
}
exports.Deino = Deino;
