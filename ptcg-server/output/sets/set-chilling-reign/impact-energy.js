"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ImpactEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.regulationMark = 'E';
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Impact Energy';
        this.fullName = 'Impact Energy CRE';
        this.text = 'This card can only be attached to a Single Strike Pokémon. If this card is attached to anything other than a Single Strike Pokémon, discard this card.' +
            '' +
            'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time. The Pokémon this card is attached to can\'t be Poisoned, and if it is already Poisoned, it recovers from that Special Condition.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Provide energy when attached to Single Strike Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            if ((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.SINGLE_STRIKE)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
            }
            return state;
        }
        // Discard card when not attached to Single Strike Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const pokemon = cardList;
                    if (!((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.SINGLE_STRIKE))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        state.players.forEach(player => {
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (!cardList.cards.includes(this)) {
                    return;
                }
                if (cardList.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                    cardList.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
                }
                return state;
            });
            return state;
        });
        return state;
    }
}
exports.ImpactEnergy = ImpactEnergy;
