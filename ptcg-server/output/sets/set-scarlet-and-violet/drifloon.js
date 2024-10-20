"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drifloon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Drifloon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gust',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Balloon Blast',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Drifloon';
        this.fullName = 'Drifloon SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Get Dodrio's damage
            const drifloonDamage = effect.player.active.damage;
            // Calculate 30 damage per counter
            const damagePerCounter = 30;
            effect.damage = (drifloonDamage * damagePerCounter / 10);
            return state;
        }
        return state;
    }
}
exports.Drifloon = Drifloon;
