"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandyFan = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
class HandyFan extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
        this.name = 'Handheld Fan';
        this.fullName = 'Handheld Fan TWM';
        this.text = 'Whenever the Active Pokémon this card is attached to takes damage from an opponent\'s attack, move an Energy from the attacking Pokémon to 1 of your opponent\'s Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if (state.phase === state_1.GamePhase.ATTACK) {
                const player = effect.player;
                const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                const hasBench = opponent.bench.some(b => b.cards.length > 0);
                if (hasBench === false) {
                    return state;
                }
                return store.prompt(state, new game_1.AttachEnergyPrompt(opponent.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                    transfers = transfers || [];
                    for (const transfer of transfers) {
                        const target = state_utils_1.StateUtils.getTarget(state, opponent, transfer.to);
                        player.active.moveCardTo(transfer.card, target);
                    }
                });
            }
        }
        return state;
    }
}
exports.HandyFan = HandyFan;
