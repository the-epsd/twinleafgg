"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurvivalCast = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SurvivalCast extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Survival Cast';
        this.fullName = 'Survival Cast SV5';
        this.text = 'If the Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            const activePokemon = player.active;
            const maxHp = activePokemon.hp;
            if (state.phase === state_1.GamePhase.ATTACK) {
                if (player.active.damage === 0) {
                    if (effect.source.damage >= maxHp) {
                        effect.preventDefault;
                        effect.damage = maxHp - 10;
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.SurvivalCast = SurvivalCast;
