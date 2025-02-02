"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalGoggles = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
class MetalGoggles extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Metal Goggles';
        this.fullName = 'Metal Goggles TEU';
        this.text = 'The [M] Pokémon this card is attached to takes 30 less damage from your opponent\'s attacks (after applying Weakness and Resistance), and your opponent\'s attacks and Abilities can\'t put damage counters on it.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.target.getPokemonCard();
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (sourceCard) {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                    // Check if damage target is owned by this card's owner 
                    const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
                    if (targetPlayer === player) {
                        effect.damage = Math.max(0, effect.damage - 30);
                        effect.damageReduced = true;
                    }
                    return state;
                }
            }
        }
        if (effect instanceof attack_effects_1.PutCountersEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.target.getPokemonCard();
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (sourceCard) {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                    // Check if damage target is owned by this card's owner 
                    const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
                    if (targetPlayer === player) {
                        effect.preventDefault = true;
                    }
                    return state;
                }
            }
        }
        return state;
    }
}
exports.MetalGoggles = MetalGoggles;
