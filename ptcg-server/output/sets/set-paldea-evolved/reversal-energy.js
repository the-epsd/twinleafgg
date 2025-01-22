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
            const isValidPokemon = attachedTo instanceof pokemon_card_1.PokemonCard
                && attachedTo.stage !== card_types_1.Stage.BASIC
                && attachedTo.stage !== card_types_1.Stage.RESTORED
                && !attachedTo.cardTag.includes(card_types_1.CardTag.POKEMON_V
                    || card_types_1.CardTag.POKEMON_ex
                    || card_types_1.CardTag.POKEMON_VSTAR
                    || card_types_1.CardTag.POKEMON_VMAX
                    || card_types_1.CardTag.RADIANT);
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
