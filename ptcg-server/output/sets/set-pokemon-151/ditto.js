"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Transformative Start',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your first turn, if this Pokémon is in the Active Spot, you may search your deck and choose a Basic Pokémon you find there, except any Ditto. If you do, discard this Pokémon and all attached cards, and put the chosen Pokémon in its place. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Splup',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.set = '151';
        this.set2 = '151';
        this.setNumber = '132';
        this.name = 'Ditto';
        this.fullName = 'Ditto MEW';
    }
}
exports.Ditto = Ditto;
