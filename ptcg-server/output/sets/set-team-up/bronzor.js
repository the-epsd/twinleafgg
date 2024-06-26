"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzor = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
                text: 'If you go second, this Pokémon can evolve during your first turn.',
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Tackle',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'TEU';
        this.name = 'Bronzor';
        this.fullName = 'Bronzor TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && state.turn === 2) {
            const cardList = game_1.StateUtils.findCardList(state, effect.pokemonCard);
            cardList.pokemonPlayedTurn = 0;
            return state;
        }
        return state;
    }
}
exports.Bronzor = Bronzor;
