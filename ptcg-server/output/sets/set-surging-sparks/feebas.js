"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feebas = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Feebas extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Leap Out',
                cost: [C],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Feebas';
        this.fullName = 'Feebas SSP';
        this.usedLeapOut = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            this.usedLeapOut = true;
        if (prefabs_1.AFTER_ATTACK(effect) && this.usedLeapOut) {
            const player = effect.player;
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
            this.usedLeapOut = false;
        }
        return state;
    }
}
exports.Feebas = Feebas;
