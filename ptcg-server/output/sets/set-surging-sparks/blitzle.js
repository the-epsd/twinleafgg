"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blitzle = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blitzle extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Add On',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            { name: 'Static Shock', cost: [L, C], damage: 20, text: '' },
        ];
        this.set = 'SSP';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Blitzle';
        this.fullName = 'Blitzle SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack == this.attacks[0])
            prefabs_1.DRAW_CARDS(effect.player, 1);
        return state;
    }
}
exports.Blitzle = Blitzle;
