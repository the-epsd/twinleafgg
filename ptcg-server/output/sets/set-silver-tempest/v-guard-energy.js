"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VGuardEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class VGuardEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'F';
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'V Guard Energy';
        this.fullName = 'V Guard Energy SIT';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy. ' +
            '' +
            'The Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon V (after applying Weakness and Resistance). This effect can\'t be applied more than once at a time to the same Pokémon.';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (effect.damageReduced) {
                // Damage already reduced, don't reduce again
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_VSTAR)) {
                // Check if damage target is owned by this card's owner 
                const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
                if (targetPlayer === player) {
                    effect.damage = Math.max(0, effect.damage - 30);
                    effect.damageReduced = true;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.VGuardEnergy = VGuardEnergy;
