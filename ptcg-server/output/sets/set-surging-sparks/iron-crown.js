"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronCrown = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class IronCrown extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUTURE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Deleting Slash',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'If your opponent has 3 or more Benched Pokémon, this attack does 80 more damage.'
            },
            {
                name: 'Slicing Blade',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            },
        ];
        this.set = 'SSP';
        this.setNumber = '132';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Iron Crown';
        this.fullName = 'Iron Crown SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (benched >= 3) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.IronCrown = IronCrown;
