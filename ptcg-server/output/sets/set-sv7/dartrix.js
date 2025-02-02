"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dartrix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Dartrix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rowlet';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'United Wings',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Pokémon in your ' +
                    'in your discard pile that have the United Wings attack.'
            },
            {
                name: 'Cutting Wind',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Dartrix';
        this.fullName = 'Dartrix SV6a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard && c.attacks.some(a => a.name === 'United Wings')) {
                    pokemonCount += 1;
                }
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Dartrix = Dartrix;
