"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendEnergyWLFM = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BlendEnergyWLFM extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Blend Energy WLFM';
        this.fullName = 'Blend Energy WLFM DRX';
        this.text = 'This card provides C Energy. When this card is attached to a Pokémon, this card provides W, L, F, or M Energy but provides only 1 Energy at a time.';
        this.blendedEnergies = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokemon = effect.player.active;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            const attackCosts = effect instanceof check_effects_1.CheckAttackCostEffect ? effect.attack.cost : [];
            const initialCosts = [...attackCosts];
            console.log(`[BlendEnergy] Initial attack costs: ${initialCosts.join(', ') || 'None'}`);
            let checkEnergy;
            if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
                checkEnergy = effect;
            }
            else {
                checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
                store.reduceEffect(state, checkEnergy);
            }
            const alreadyProvided = checkEnergy.energyMap.flatMap(e => e.provides);
            const blendProvided = checkEnergy.energyMap
                .filter(e => e.card instanceof BlendEnergyWLFM)
                .flatMap(e => e.provides);
            let neededType;
            for (const cost of initialCosts) {
                if (this.blendedEnergies.includes(cost) && !alreadyProvided.includes(cost) && !blendProvided.includes(cost)) {
                    neededType = cost;
                    break;
                }
            }
            if (neededType) {
                checkEnergy.energyMap.push({
                    card: this,
                    provides: [neededType]
                });
                console.log(`[BlendEnergy] Provided energy type: ${neededType}`);
            }
            const finalEnergy = checkEnergy.energyMap.flatMap(e => e.provides);
            console.log(`[BlendEnergy] Final energy provided: ${finalEnergy.join(', ') || 'None'}`);
            console.log(`[BlendEnergy] Final attack cost check: ${effect.attack.cost.join(', ')}`);
        }
        return state;
    }
}
exports.BlendEnergyWLFM = BlendEnergyWLFM;
