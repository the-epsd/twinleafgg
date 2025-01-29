"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Omanyte = void 0;
const game_1 = require("../../game");
class Omanyte extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = W;
        this.hp = 40;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Clairvoyance',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Your opponent plays with his or her hand face up. This power stops working while Omanyte is Asleep, Confused, or Paralyzed.',
            }];
        this.attacks = [{
                name: 'Water Gun',
                cost: [W],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each [W] Energy attached to Omanyte but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.',
            }];
        this.set = 'FO';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Omanyte';
        this.fullName = 'Omanyte FO';
    }
}
exports.Omanyte = Omanyte;
