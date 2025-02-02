"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiqueHelixFossil = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class AntiqueHelixFossil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.TRAINER;
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.text = 'Play this card as if it were a 60-HP Basic [C] Pokémon. This card can\'t be affected by any Special Conditions and can\'t retreat.' +
            'At any time during your turn, you may discard this card from play.';
        this.powers = [{
                name: 'Helical Swell',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Stadium cards from their hand.'
            }];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '153';
        this.name = 'Antique Helix Fossil';
        this.fullName = 'Antique Helix Fossil MEW';
    }
}
exports.AntiqueHelixFossil = AntiqueHelixFossil;
