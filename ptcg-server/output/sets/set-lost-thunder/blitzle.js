"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blitzle = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Blitzle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.evolvesInto = 'Zebstrika';
        this.attacks = [{
                name: 'Flop',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                text: ''
            }, {
                name: 'Zap Kick',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'LOT';
        this.name = 'Blitzle';
        this.fullName = 'Blitzle LOT';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Blitzle = Blitzle;
