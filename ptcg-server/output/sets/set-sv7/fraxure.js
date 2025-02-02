"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraxure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
class Fraxure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Axew';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 100;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Unnerve',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokemon.'
            }];
        this.attacks = [{
                name: 'Dragon Pulse',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL],
                damage: 80,
                text: 'Discard the top card of your deck'
            }];
        this.set = 'SV6a';
        this.name = 'Fraxure';
        this.fullName = 'Fraxure SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.regulationMark = 'H';
    }
}
exports.Fraxure = Fraxure;
