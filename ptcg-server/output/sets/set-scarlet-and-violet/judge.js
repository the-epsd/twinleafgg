"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class N extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DP';
        this.name = 'N';
        this.fullName = 'N NV';
        this.text = 'Each player shuffles his or her hand into his or her deck. ' +
            'Then, each player draws a card for each of his or her remaining Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.deck);
            opponent.hand.moveTo(opponent.deck);
            store.prompt(state, [
                new shuffle_prompt_1.ShuffleDeckPrompt(player.id),
                new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id)
            ], deckOrder => {
                player.deck.applyOrder(deckOrder[0]);
                opponent.deck.applyOrder(deckOrder[1]);
                player.deck.moveTo(player.hand, player.getPrizeLeft());
                opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());
            });
        }
        return state;
    }
}
exports.N = N;
