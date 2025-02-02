"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CounterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'CIN';
        this.name = 'Counter Energy';
        this.fullName = 'Counter Energy CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.text = 'This card provides [C] Energy. If you have more Prize cards remaining than your opponent, and if this card is attached to a Pokémon that isn\'t a Pokémon-GX or Pokémon-EX, this card provides every type of Energy but provides only 2 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const attachedTo = effect.source;
            const attachedToExOrGx = attachedTo.cards.some(card => {
                return card instanceof game_1.PokemonCard && (card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_GX));
            });
            if (!!attachedTo.getPokemonCard() && player.getPrizeLeft() > opponent.getPrizeLeft() && !attachedToExOrGx) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
            }
            else {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
        }
        return state;
    }
}
exports.CounterEnergy = CounterEnergy;
