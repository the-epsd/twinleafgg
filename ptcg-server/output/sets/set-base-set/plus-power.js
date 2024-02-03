"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlusPower = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class PlusPower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'PlusPower';
        this.fullName = 'PlusPower BS';
        this.text = 'Attach PlusPower to your Active Pokémon. At the end of your turn, discard PlusPower. If this Pokémon\'s attack does damage to the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage to the Defending Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.source.tool !== undefined) {
                const playTrainer = new play_card_effects_1.TrainerEffect(effect.player, effect.trainerCard, effect.target);
                state = store.reduceEffect(state, playTrainer);
            }
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            effect.damage += 10;
            return state;
        }
        return state;
    }
}
exports.PlusPower = PlusPower;
