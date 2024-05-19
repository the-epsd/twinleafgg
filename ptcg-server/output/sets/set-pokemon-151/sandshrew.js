"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandshrew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Sandshrew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sand Screen',
                powerType: game_1.PowerType.ABILITY,
                text: 'Trainer cards in your opponent\'s discard pile can\'t be put into their deck by an effect of your opponent\'s Item or Supporter cards.'
            }];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: '',
            }
        ];
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.set = 'PAF';
        this.name = 'Sandshrew';
        this.fullName = 'Sandshrew PAF';
    }
}
exports.Sandshrew = Sandshrew;
