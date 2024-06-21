"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useEvolutionaryAdvantage(next, store, state, self, effect) {
    // Get current turn
    const turn = state.turn;
    // Check if it is player's first turn going second, allow evolution
    if (turn === 2 && effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === self) {
        effect.preventDefault = true;
    }
}
class Bronzor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Evolutionary Advantage',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If you go second, this Pokemon can evolve during your first turn.'
            }];
        this.attacks = [{
                name: 'Tackle',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Bronzor';
        this.fullName = 'Bronzor TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useEvolutionaryAdvantage(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Bronzor = Bronzor;
