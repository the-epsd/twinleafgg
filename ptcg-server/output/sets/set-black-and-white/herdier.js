"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Herdier = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Herdier extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lillipup';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Collect', cost: [C, C], damage: 0, text: 'Draw 3 cards.' },
            { name: 'Bite', cost: [C, C, C], damage: 50, text: '' },
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Herdier';
        this.fullName = 'Herdier BLW';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DRAW_CARDS(effect.player, 3);
        }
        return state;
    }
}
exports.Herdier = Herdier;
