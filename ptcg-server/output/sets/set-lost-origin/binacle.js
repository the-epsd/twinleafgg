"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Binacle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Binacle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Mud-Slap',
                cost: [F],
                damage: 10,
                text: ''
            },
            {
                name: 'Slash',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'LOR';
        this.setNumber = '106';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Binacle';
        this.fullName = 'Binacle LOR';
    }
}
exports.Binacle = Binacle;
