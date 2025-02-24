"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absol = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Absol extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.tags = [game_1.CardTag.TEAM_PLASMA];
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mind Jack',
                cost: [D, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 more damage for each of your opponent\'s Benched Pokémon.'
            },
            { name: 'Fearsome Shadow', cost: [D, C, C], damage: 60, text: 'Your opponent reveals his or her hand.' },
        ];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Absol';
        this.fullName = 'Absol PLF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage += (opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 20);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
        }
        return state;
    }
}
exports.Absol = Absol;
