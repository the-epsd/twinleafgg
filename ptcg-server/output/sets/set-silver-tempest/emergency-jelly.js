"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyJelly = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class EmergencyJelly extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.name = 'Emergency Jelly';
        this.fullName = 'Emergency Jelly SIT';
        this.text = 'At the end of each turn, if the Pokémon this card is attached to has 30 HP or less remaining and has any damage counters on it, heal 120 damage from it. If you healed any damage in this way, discard this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tool === this) {
            if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.target.tool === this) {
                const targetPokemon = effect.target.getPokemonCard();
                if (targetPokemon && targetPokemon.hp <= 30) {
                    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
                    healTargetEffect.target = targetPokemon;
                    state = store.reduceEffect(state, healTargetEffect);
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.EmergencyJelly = EmergencyJelly;
