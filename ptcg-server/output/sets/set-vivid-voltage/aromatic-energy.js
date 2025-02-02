"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AromaticEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AromaticEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [C];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.regulationMark = 'D';
        this.name = 'Aromatic Energy';
        this.fullName = 'Aromatic Energy VIV';
        this.text = 'As long as this card is attached to a Pokémon, it provides [G] Energy.' +
            '' +
            'The [G] Pokémon this card is attached to recovers from all Special Conditions and can\'t be affected by any Special Conditions.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [G] });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const pokemon = effect.target;
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect &&
            (game_1.StateUtils.findCardList(state, this) instanceof game_1.PokemonCardList) &&
            game_1.StateUtils.findCardList(state, this).cards.includes(this)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList instanceof game_1.PokemonCardList && cardList.cards.includes(this)) {
                const conditionsToKeep = [card_types_1.SpecialCondition.ABILITY_USED];
                const hasSpecialCondition = cardList.specialConditions.some(condition => !conditionsToKeep.includes(condition));
                if (hasSpecialCondition) {
                    cardList.specialConditions = cardList.specialConditions.filter(condition => conditionsToKeep.includes(condition));
                }
            }
        }
        return state;
    }
}
exports.AromaticEnergy = AromaticEnergy;
