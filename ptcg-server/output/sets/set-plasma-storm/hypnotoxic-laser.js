"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HypnotoxicLaser = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const active = opponent.active;
    const isPoisoned = active.specialConditions.includes(card_types_1.SpecialCondition.POISONED);
    const isAsleep = active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP);
    if (isPoisoned && isAsleep) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
    let coinResult = false;
    yield store.prompt(state, [
        new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
    ], result => {
        coinResult = result;
        next();
    });
    if (coinResult === false) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
    return state;
}
class HypnotoxicLaser extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PLS';
        this.name = 'Hypnotoxic Laser';
        this.fullName = 'Hypnotoxic Laser PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.text = 'Your opponent\'s Active Pokemon is now Poisoned. Flip a coin. ' +
            'If heads, your opponent\'s Active Pokemon is also Asleep.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.HypnotoxicLaser = HypnotoxicLaser;
