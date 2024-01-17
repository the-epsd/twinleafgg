"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bellsprout = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
class Bellsprout extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Venoshock',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'If your opponent\'s Active Pokémon is Poisoned, this attack' +
                    'does 40 more damage.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Bellsprout';
        this.fullName = 'Bellsprout BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            let damage = 10;
            if (effect.opponent.active.specialConditions.includes(card_types_2.SpecialCondition.POISONED)) {
                damage += 40;
            }
            effect.damage = damage;
        }
        return state;
    }
}
exports.Bellsprout = Bellsprout;
