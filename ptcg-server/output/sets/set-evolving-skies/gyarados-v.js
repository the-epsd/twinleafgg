"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GyaradosV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GyaradosV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Gyarados V';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Get Angry',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage for each damage counter on this Pokémon.'
            }, {
                name: 'Max Tyrant',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: ''
            }];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Gyarados V';
        this.fullName = 'Gyarados V EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Get Drifloon's damage
            const gyaradosDamage = effect.player.active.damage;
            // Calculate 20 damage per counter
            const damagePerCounter = 20;
            effect.damage = gyaradosDamage * damagePerCounter;
            return state;
        }
        return state;
    }
}
exports.GyaradosV = GyaradosV;
