"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raticate = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Raticate extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Raticate';
        this.set = 'BS';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.fullName = 'Raticate BS';
        this.setNumber = '40';
        this.cardImage = 'assets/cardback.png';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rattata';
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bite',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Super Fang',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Does damage to the Defending Pokémon equal to half the Defending Pokémon\'s remaining HP (rounded up to the nearest 10).'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const target = effect.target;
            const remainingHP = target.hp - target.damage;
            effect.damage = Math.ceil(remainingHP / 2 / 10) * 10;
        }
        return state;
    }
}
exports.Raticate = Raticate;
