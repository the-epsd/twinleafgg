"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalCoreBarrier = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
class MetalCoreBarrier extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '180';
        this.name = 'Metal Core Barrier';
        this.fullName = 'Metal Core Barrier UNB';
        this.text = 'If this card is attached to 1 of your Pokémon, discard it at the end of your opponent\'s turn. The [M] Pokémon this card is attached to takes 70 less damage from your opponent\'s attacks (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const player = state_utils_1.StateUtils.findOwner(state, cardList);
            if (effect.player === player) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                    cardList.tool = undefined;
                }
            });
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
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
                effect.damage = Math.max(0, effect.damage - 70);
                effect.damageReduced = true;
            }
            return state;
        }
        return state;
    }
}
exports.MetalCoreBarrier = MetalCoreBarrier;
