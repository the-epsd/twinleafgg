"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatFireEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HeatFireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DAA';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
        this.name = 'Heat Fire Energy';
        this.fullName = 'Heat Fire Energy DAA';
        this.text = 'As long as this card is attached to a Pokémon, it provides [R] Energy.' +
            '' +
            'The [R] Pokémon this card is attached to gets +20 HP.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FIRE] });
            return state;
        }
        // Prevent effects of attacks
        if (effect instanceof check_effects_1.CheckHpEffect && ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this))) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.FIRE)) {
                effect.hp += 20;
            }
        }
        return state;
    }
}
exports.HeatFireEnergy = HeatFireEnergy;
