"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Judge = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class Judge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '235';
        this.regulationMark = 'E';
        this.name = 'Judge';
        this.fullName = 'Judge FST';
        this.text = 'Each player shuffles their hand into their deck and draws 4 cards.';
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
                player.deck.moveTo(player.hand, 4);
                opponent.deck.moveTo(opponent.hand, 4);
            });
        }
        return state;
    }
}
exports.Judge = Judge;
