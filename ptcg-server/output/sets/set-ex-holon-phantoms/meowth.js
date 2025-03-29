"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowth = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meowth extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = D;
        this.additionalCardTypes = [M];
        this.stage = game_1.Stage.BASIC;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Slash',
                cost: [D],
                damage: 10,
                text: ''
            },
            {
                name: 'Pay Day',
                cost: [M, C],
                damage: 10,
                text: 'Draw a card.'
            }];
        this.set = 'HP';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meowth';
        this.fullName = 'Meowth HP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            prefabs_1.DRAW_CARDS(player, 1);
        }
        return state;
    }
}
exports.Meowth = Meowth;
