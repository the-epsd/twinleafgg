"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullFaceGuard = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class FullFaceGuard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Full Face Guard';
        this.fullName = 'Full Face Guard EVS';
        this.text = 'If the Pokémon this card is attached to has no Abilities, it takes 20 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 20
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (sourceCard && sourceCard.powers.length === 0) {
                // Check if damage target is owned by this card's owner 
                const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
                if (targetPlayer === player) {
                    effect.damage = Math.max(0, effect.damage - 20);
                    effect.damageReduced = true;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.FullFaceGuard = FullFaceGuard;
