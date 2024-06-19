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
        this.regulationMark = 'H';
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Blend Energy WLFM';
        this.fullName = 'Blend Energy WLFM DRX';
        this.text = 'This card provides C Energy. When this card is attached to a Pokémon, this card provides W, L, F, or M Energy but provides only 1 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            const pokemonCard = effect.source.getPokemonCard();
            const attackCost = pokemonCard && pokemonCard.attacks[0].cost;
            const providedEnergy = [];
            if (attackCost) {
                const attachedEnergy = effect.source.cards.filter(card => card instanceof energy_card_1.EnergyCard);
                const attachedEnergyTypes = new Set(attachedEnergy.flatMap(energy => energy.provides));
                for (const costType of attackCost) {
                    if (!attachedEnergyTypes.has(costType)) {
                        if (costType === card_types_1.CardType.WATER || costType === card_types_1.CardType.LIGHTNING || costType === card_types_1.CardType.FIGHTING || costType === card_types_1.CardType.METAL) {
                            providedEnergy.push(costType);
                        }
                    }
                }
            }
            if (providedEnergy.length > 0) {
                effect.energyMap.push({ card: this, provides: providedEnergy });
            }
            // if (attackCost && attackCost.includes(CardType.WATER)) {
            //   providedEnergy = [CardType.WATER];
            // } else if (attackCost && attackCost.includes(CardType.LIGHTNING)) {
            //   providedEnergy = [CardType.LIGHTNING];
            // } else if (attackCost && attackCost.includes(CardType.FIGHTING)) {
            //   providedEnergy = [CardType.FIGHTING];
            // } else if (attackCost && attackCost.includes(CardType.METAL)) {
            //   providedEnergy = [CardType.METAL];
            // }
            return state;
        }
        return state;
    }
}
exports.BlendEnergyWLFM = BlendEnergyWLFM;
