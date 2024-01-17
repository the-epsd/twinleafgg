"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandTrimmer = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
class HandTrimmer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'H';
        this.set = 'SV5K';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Hand Trimmer';
        this.fullName = 'Hand Trimmer SV5K';
        this.text = 'Both players discard cards from their hand until they each have 5 cards in hand. (Your opponent discards first. Any player with 5 cards or less in their hands do not discard any cards.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            // Get opponent's hand length
            const opponentHandLength = opponent.hand.cards.length;
            // Set discard amount to reach hand size of 5
            const discardAmount = opponentHandLength - 5;
            // Opponent discards first
            while (opponent.hand.cards.length > 5) {
                store.prompt(state, new __1.ChooseCardsPrompt(opponent.id, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: discardAmount, max: discardAmount, allowCancel: false }), selected => {
                    const cards = selected || [];
                    opponent.hand.moveCardsTo(cards, opponent.discard);
                });
            }
            // Get opponent's hand length
            const playerHandLength = player.hand.cards.length;
            // Set discard amount to reach hand size of 5
            const playerDiscardAmount = playerHandLength - 5;
            // Opponent discards first
            while (opponent.hand.cards.length > 5) {
                store.prompt(state, new __1.ChooseCardsPrompt(opponent.id, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: playerDiscardAmount, max: playerDiscardAmount, allowCancel: false }), selected => {
                    const cards = selected || [];
                    opponent.hand.moveCardsTo(cards, opponent.discard);
                });
            }
            return state;
        }
        return state;
    }
}
exports.HandTrimmer = HandTrimmer;
