"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalFryingPan = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
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
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (effect.damageReduced) {
                // Damage already reduced, don't reduce again
                return state;
            }
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (sourceCard) {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.source);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                    // Check if damage target is owned by this card's owner 
                    const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
                    if (targetPlayer === player) {
                        effect.damage = Math.max(0, effect.damage - 30);
                        effect.damageReduced = true;
                    }
                    effect.attackEffect.ignoreWeakness = true;
                    return state;
                }
            }
        }
        return state;
    }
}
exports.MetalFryingPan = MetalFryingPan;
