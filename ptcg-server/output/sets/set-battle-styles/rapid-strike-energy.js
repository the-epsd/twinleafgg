"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapidStrikeEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class RapidStrikeEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.cardTag = [card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BST';
        this.set2 = 'battlestyles';
        this.setNumber = '140';
        this.name = 'Rapid Strike Energy';
        this.fullName = 'Rapid Strike Energy BST';
        this.text = 'This card can only be attached to a Rapid Strike Pokémon. If this card is attached to anything other than a Rapid Strike Pokémon, discard this card.' +
            '' +
            'As long as this card is attached to a Pokémon, it provides 2 in any combination of W Energy and F Energy.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Provide energy when attached to Rapid Strike Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            if ((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.RAPID_STRIKE)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FIGHTING || card_types_1.CardType.WATER] });
            }
            return state;
        }
        // Discard card when not attached to Rapid Strike Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const pokemon = cardList;
                    if (!((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.RAPID_STRIKE))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.RapidStrikeEnergy = RapidStrikeEnergy;
