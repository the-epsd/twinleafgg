"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regice = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Regice extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Regi Gate',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Blizzard Bind',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'If the Defending Pokémon is a Pokémon V, it can\'t attack during your opponent\'s next turn.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.set2 = 'astralradiance';
        this.setNumber = '37';
        this.name = 'Regice';
        this.fullName = 'Regice ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            //   if (opponent.active && opponent.active.cards.some(c => c instanceof PokemonCard && c.category === CardType.POKEMON_V)) {
            //     opponent.active.setNoAttackNextTurn();
            //   }
            // }
            return state;
        }
        return state;
    }
}
exports.Regice = Regice;
