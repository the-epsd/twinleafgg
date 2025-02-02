"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bidoof = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Bidoof extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Rollout',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Bidoof';
        this.fullName = 'Bidoof BRS';
    }
}
exports.Bidoof = Bidoof;
