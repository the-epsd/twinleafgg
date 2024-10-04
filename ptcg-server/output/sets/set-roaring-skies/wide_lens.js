"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WideLens = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class WideLens extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'ROS';
        this.name = 'Wide Lens';
        this.fullName = 'Muscle Band ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.text = ' Damage from the attacks of the Pokémon this card is attached to'
            + ' is affected by Weakness and Resistance for your opponent\'s Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            opponent.bench.forEach(card => {
                if (effect.damage > 0 && effect.target === card) {
                    const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect.attackEffect, effect.damage);
                    applyWeakness.target = effect.target;
                    state = store.reduceEffect(state, applyWeakness);
                    effect.damage = applyWeakness.damage;
                }
                const damage = Math.max(0, effect.damage);
                if (damage > 0) {
                    const afterDamageEffect = new attack_effects_1.AfterDamageEffect(effect.attackEffect, damage);
                    afterDamageEffect.target = effect.target;
                    store.reduceEffect(state, afterDamageEffect);
                }
            });
            return state;
        }
        return state;
    }
}
exports.WideLens = WideLens;
