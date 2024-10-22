"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.evolvesTo = ['Magnezone', 'Magnezone ex'];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: 2 }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sonicboom',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
            },
            {
                name: 'Selfdestruct',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 100,
                text: 'Does 20 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Magneton does 100 damage to itself.'
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Magneton';
        this.fullName = 'Magneton FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Implement Sonicboom logic
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Implement Selfdestruct logic
        }
        return state;
    }
}
exports.Magneton = Magneton;
