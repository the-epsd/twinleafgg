"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VengefulPunch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class VengefulPunch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'OBF';
        this.set2 = 'obsidianflames';
        this.setNumber = '197';
        this.name = 'Vengeful Punch';
        this.fullName = 'Vengeful Punch OBF';
        this.text = 'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 4 damage counters on the Attacking Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tool === this) {
            // eslint-disable-next-line indent
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targetPlayer = player.active;
            if (effect instanceof game_effects_1.KnockOutEffect && targetPlayer === effect.target) {
                opponent.active.damage += 40;
            }
        }
        return state;
    }
}
exports.VengefulPunch = VengefulPunch;
