"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalFryingPan = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_1 = require("../../game/store/state/state");
class MetalFryingPan extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Metal Frying Pan';
        this.fullName = 'Metal Frying Pan FLI';
        this.text = 'The [M] Pokémon this card is attached to takes 30 less damage from your opponent\'s attacks (after applying Weakness and Resistance) and has no Weakness.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            //const sourceCard = effect.target.getPokemonCard();
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                // Allow damage
                effect.attackEffect.ignoreWeakness = true;
                effect.damage = Math.max(0, effect.damage - 30);
                effect.damageReduced = true;
                const target = effect.target.getPokemonCard();
                if (target) {
                    target.weakness = [];
                }
                return state;
            }
        }
        return state;
    }
}
exports.MetalFryingPan = MetalFryingPan;
