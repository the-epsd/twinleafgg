"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapidStrikeEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class RapidStrikeEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Rapid Strike Energy';
        this.fullName = 'Rapid Strike Energy BST';
        this.text = 'This card can only be attached to a Rapid Strike Pokémon. If this card is attached to anything other than a Rapid Strike Pokémon, discard this card.' +
            '' +
            'As long as this card is attached to a Pokémon, it provides 2 in any combination of W Energy and F Energy.';
    }
    reduceEffect(store, state, effect) {
        // Provide energy when attached to Rapid Strike Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            const pokemonCard = pokemon.getPokemonCard();
            if (pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.tags.includes(card_types_1.CardTag.RAPID_STRIKE)) {
                const attackCosts = pokemonCard.attacks.map(attack => attack.cost);
                const existingEnergy = pokemon.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                const existingWater = existingEnergy.filter(c => 'provides' in c && c.provides.includes(card_types_1.CardType.WATER)).length;
                const existingFighting = existingEnergy.filter(c => 'provides' in c && c.provides.includes(card_types_1.CardType.FIGHTING)).length;
                const needsWater = attackCosts.some(cost => cost.filter(c => c === card_types_1.CardType.WATER).length > existingWater);
                const needsFighting = attackCosts.some(cost => cost.filter(c => c === card_types_1.CardType.FIGHTING).length > existingFighting);
                if (needsWater && needsFighting) {
                    effect.energyMap.push({ card: this, provides: [card_types_1.CardType.WATER, card_types_1.CardType.FIGHTING] });
                }
                else if (needsWater) {
                    effect.energyMap.push({ card: this, provides: [card_types_1.CardType.WATER, card_types_1.CardType.WATER] });
                }
                else if (needsFighting) {
                    effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING] });
                }
                else {
                    effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
                }
            }
            return state;
        }
        // Discard card when not attached to Rapid Strike Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const pokemon = cardList;
                    const pokemonCard = pokemon.getPokemonCard();
                    if (pokemonCard && !pokemonCard.tags.includes(card_types_1.CardTag.RAPID_STRIKE)) {
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
