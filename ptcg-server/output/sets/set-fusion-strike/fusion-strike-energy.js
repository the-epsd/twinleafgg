"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionStrikeEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class FusionStrikeEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '244';
        this.regulationMark = 'E';
        this.name = 'Fusion Strike Energy';
        this.fullName = 'Fusion Strike Energy FST';
        this.text = 'This card can only be attached to a Fusion Strike Pokémon. If this card is attached to anything other than a Fusion Strike Pokémon, discard this card. ' +
            ' ' +
            'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time. Prevent all effects of your opponent\'s Pokémon\'s Abilities done to the Pokémon this card is attached to.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Provide energy when attached to Fusion Strike Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            if ((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
            }
            return state;
        }
        // Discard card when not attached to Fusion Strike Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const pokemon = cardList;
                    if (!((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.FUSION_STRIKE))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.FusionStrikeEnergy = FusionStrikeEnergy;
