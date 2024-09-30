"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zweilous = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Zweilous extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Deino';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Stomp Off',
                cost: [D],
                damage: 0,
                text: 'Discard the top 2 cards of your opponent\'s deck.'
            },
            {
                name: 'Darkness Fang',
                cost: [D, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zweilous';
        this.fullName = 'Zweilous SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 2);
        }
        return state;
    }
}
exports.Zweilous = Zweilous;
