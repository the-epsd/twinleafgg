"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReversalEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ReversalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '192';
        this.name = 'Reversal Energy';
        this.fullName = 'Reversal Energy PAL';
        this.text = 'As long as this card is attached to a Pokémon, it provides C Energy.' +
            '' +
            'If you have more Prize cards remaining than your opponent, and if this card is attached to an Evolution Pokémon that doesn\'t have a Rule Box (Pokémon ex, Pokémon V, etc. have Rule Boxes), this card provides every type of Energy but provides only 3 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const attachedTo = effect.source.getPokemonCard();
            // Check if it's an Evolution Pokémon (not Basic or Restored)
            const isEvolutionPokemon = attachedTo instanceof pokemon_card_1.PokemonCard
                && attachedTo.stage !== card_types_1.Stage.BASIC
                && attachedTo.stage !== card_types_1.Stage.RESTORED;
            // Check if it doesn't have a Rule Box
            const hasRuleBox = attachedTo instanceof pokemon_card_1.PokemonCard && (attachedTo.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_VUNION) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_EX) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_GX) ||
                attachedTo.tags.includes(card_types_1.CardTag.TAG_TEAM) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_LV_X) ||
                attachedTo.tags.includes(card_types_1.CardTag.BREAK) ||
                attachedTo.tags.includes(card_types_1.CardTag.PRISM_STAR) ||
                attachedTo.tags.includes(card_types_1.CardTag.MEGA) ||
                attachedTo.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA) ||
                attachedTo.tags.includes(card_types_1.CardTag.LEGEND) ||
                attachedTo.tags.includes(card_types_1.CardTag.RADIANT));
            const isValidPokemon = isEvolutionPokemon && !hasRuleBox;
            const provides = player.getPrizeLeft() > opponent.getPrizeLeft() && isValidPokemon
                ? [card_types_1.CardType.ANY, card_types_1.CardType.ANY, card_types_1.CardType.ANY]
                : [card_types_1.CardType.COLORLESS];
            effect.energyMap.push({ card: this, provides });
            return state;
        }
        return state;
    }
}
exports.ReversalEnergy = ReversalEnergy;
