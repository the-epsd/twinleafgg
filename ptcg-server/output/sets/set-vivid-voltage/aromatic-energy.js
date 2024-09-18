"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AromaticEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AromaticEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
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
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const pokemon = effect.target;
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.cards.includes(this)) {
            effect.preventDefault = true;
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            if (effect instanceof check_effects_1.CheckTableStateEffect) {
                state.players.forEach(player => {
                    if (pokemon.specialConditions.length === 0) {
                        return;
                    }
                    try {
                        const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                        store.reduceEffect(state, energyEffect);
                    }
                    catch (_a) {
                        return state;
                    }
                    const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
                    store.reduceEffect(state, checkPokemonTypeEffect);
                    if (checkPokemonTypeEffect) {
                        const conditions = pokemon.specialConditions.slice();
                        conditions.forEach(condition => {
                            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
                            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                        });
                    }
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.AromaticEnergy = AromaticEnergy;
