"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockChestplate = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RockChestplate extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '192';
        this.name = 'Rock Chestplate';
        this.fullName = 'Rock Chestplate SVI';
        this.text = 'The F Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const sourceCard = player.active.getPokemonCard();
            if ((sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.cardType) == card_types_1.CardType.FIGHTING) {
                // Check if damage target is owned by this card's owner 
                const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
                if (targetPlayer === player) {
                    effect.damage = Math.max(0, effect.damage - 30);
                    effect.damageReduced = true;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.RockChestplate = RockChestplate;
