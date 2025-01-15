"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegenerativeEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class RegenerativeEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '168';
        this.name = 'Regenerative Energy';
        this.fullName = 'Regenerative Energy SIT';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
            '' +
            'Whenever you play a Pokémon from your hand to evolve the Pokémon V this card is attached to, heal 100 damage from that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Provide energy when attached to Single Strike Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const pokemon = effect.source;
            if ((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                const healEffect = new game_effects_1.HealEffect(player, pokemon, 100);
                store.reduceEffect(state, healEffect);
            }
            return state;
        }
        return state;
    }
}
exports.RegenerativeEnergy = RegenerativeEnergy;
