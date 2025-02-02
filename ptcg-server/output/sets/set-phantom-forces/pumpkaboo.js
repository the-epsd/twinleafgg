"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pumpkaboo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Pumpkaboo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ram',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: ''
            },
            {
                name: 'Night March',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage times the number of Pokemon ' +
                    'in your discard pile that have the Night March attack.'
            }
        ];
        this.set = 'PHF';
        this.name = 'Pumpkaboo';
        this.fullName = 'Pumpkaboo PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard && c.attacks.some(a => a.name === 'Night March')) {
                    pokemonCount += 1;
                }
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Pumpkaboo = Pumpkaboo;
