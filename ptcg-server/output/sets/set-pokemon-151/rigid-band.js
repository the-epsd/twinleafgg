"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RigidBand = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
class RigidBand extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Rigid Band';
        this.fullName = 'Rigid Band MEW';
        this.text = 'The Stage 1 Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.target.getPokemonCard();
            if ((sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.stage) !== card_types_1.Stage.STAGE_1) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (effect.damageReduced) {
                // Damage already reduced, don't reduce again
                return state;
            }
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Check if damage target is owned by this card's owner 
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (targetPlayer === player) {
                effect.damage = Math.max(0, effect.damage - 30);
                effect.damageReduced = true;
            }
            return state;
        }
        return state;
    }
}
exports.RigidBand = RigidBand;
