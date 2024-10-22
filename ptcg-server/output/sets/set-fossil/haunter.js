"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.evolvesTo = ['Gengar', 'Gengar ex'];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: 30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Transparency',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Whenever an attack does anything to Haunter, flip a coin. If heads, prevent all effects of that attack, including damage, done to Haunter. This power stops working while Haunter is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Nightmare',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Haunter';
        this.fullName = 'Haunter JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            //Implement ability logic
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            //Implement attack logic
        }
        return state;
    }
}
exports.Haunter = Haunter;
