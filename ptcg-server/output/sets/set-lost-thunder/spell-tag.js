"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellTag = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
class SpellTag extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'LOT';
        this.name = 'Spell Tag';
        this.fullName = 'Spell Tag LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '190';
        this.text = 'When the [P] Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, put 4 damage counters on your opponent\'s Pokémon in any way you like.';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.tool === this) {
            this.damageDealt = false;
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) &&
            effect.target.tool === this) {
            const player = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (player.active.tool === this) {
                this.damageDealt = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player === state_utils_1.StateUtils.getOpponent(state, effect.player)) {
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (owner === effect.player) {
                this.damageDealt = false;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            // const target = effect.target;
            if (this.damageDealt) {
                const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                const maxAllowedDamage = [];
                opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    maxAllowedDamage.push({ target, damage: card.hp + 40 });
                });
                return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], 40, maxAllowedDamage, { allowCancel: false }), targets => {
                    const results = targets || [];
                    for (const result of results) {
                        const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
                        /*const putCountersEffect = new PutCountersEffect(result.target as unknown as AttackEffect, result.damage);
                        putCountersEffect.target = target;
                        store.reduceEffect(state, putCountersEffect);*/
                        target.damage += result.damage;
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.SpellTag = SpellTag;
