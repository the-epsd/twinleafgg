"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkSquirtle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DarkSquirtle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 170;
        this.weakness = [{
                type: card_types_1.CardType.LIGHTNING
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Bubble',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 500,
                text: 'TAKE ANOTHER TURN IF KO'
            }];
        this.set = 'BS';
        this.name = 'Dark Squirtle';
        this.fullName = 'Dark Squirtle BS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.TakeAnotherTurnEffect && effect.attack === this.attacks[0]) {
            effect.damage = 500;
        }
        return state;
    }
}
exports.DarkSquirtle = DarkSquirtle;
