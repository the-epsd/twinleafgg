"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agatha = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        const maxAllowedDamage = [];
        opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
            maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
        });
        // We will discard this card after prompt confirmation
        effect.preventDefault = true;
        return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE], maxAllowedDamage, { min: 1, max: 3, allowCancel: false }), transfers => {
            if (transfers === null) {
                return;
            }
            for (const transfer of transfers) {
                const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                if (source.damage >= 20) {
                    source.damage -= 20;
                    target.damage += 20;
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            }
        });
    });
}
class Agatha extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.name = 'Agatha';
        this.fullName = 'Agatha CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Agatha = Agatha;
