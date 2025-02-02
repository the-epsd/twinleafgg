"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefianceVest = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DefianceVest extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.set = 'PAR';
        this.name = 'Defiance Vest';
        this.fullName = 'Defiance Vest PAR';
        this.text = 'If you have more Prize cards remaining than your opponent, the Pokémon this card is attached to takes 40 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 40
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (effect.damageReduced) {
                // Damage already reduced, don't reduce again
                return state;
            }
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if damage target is owned by this card's owner 
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (targetPlayer === player) {
                effect.damage = Math.max(0, effect.damage - 40);
                effect.damageReduced = true;
            }
            return state;
        }
        return state;
    }
}
exports.DefianceVest = DefianceVest;
