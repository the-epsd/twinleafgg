"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TherapeuticEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TherapeuticEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '193';
        this.regulationMark = 'G';
        this.name = 'Therapeutic Energy';
        this.fullName = 'Therapeutic Energy PAL';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
            '' +
            'The Pokémon this card is attached to recovers from being Asleep, Confused, or Paralyzed and can\'t be affected by those Special Conditions.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const pokemon = effect.target;
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList instanceof game_1.PokemonCardList && cardList.cards.includes(this)) {
                const conditionsToKeep = [card_types_1.SpecialCondition.ABILITY_USED, card_types_1.SpecialCondition.POISONED, card_types_1.SpecialCondition.BURNED];
                const hasSpecialCondition = cardList.specialConditions.some(condition => !conditionsToKeep.includes(condition));
                if (hasSpecialCondition) {
                    cardList.specialConditions = cardList.specialConditions.filter(condition => conditionsToKeep.includes(condition));
                }
            }
        }
        return state;
    }
}
exports.TherapeuticEnergy = TherapeuticEnergy;
