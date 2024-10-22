"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoaringMoon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class RoaringMoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Vengeance Fletching',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 70,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each Ancient card in your discard pile.'
            },
            {
                name: 'Speed Wing',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Roaring Moon';
        this.fullName = 'Roaring Moon TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const cards = effect.player.discard.cards.filter(c => c.tags.includes(card_types_1.CardTag.ANCIENT)).length;
            effect.damage += 10 * cards;
            return state;
        }
        return state;
    }
}
exports.RoaringMoon = RoaringMoon;
