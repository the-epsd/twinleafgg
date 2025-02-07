"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansPichu = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EthansPichu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.ETHANS];
        this.cardType = L;
        this.hp = 30;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [{
                name: 'Sparking Draw',
                cost: [],
                damage: 30,
                text: 'Draw a card.'
            }];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Ethan\'s Pichu';
        this.fullName = 'Ethan\'s Pichu SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.DRAW_CARDS(player, 1);
        }
        return state;
    }
}
exports.EthansPichu = EthansPichu;
