"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XerosicsScheme = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
class XerosicsScheme extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'H';
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Xerosic\'s Scheme';
        this.fullName = 'Xerosic\'s Scheme SV6a';
        this.text = 'Your opponent discards cards from their hand until they have 3 cards in their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new __1.GameError(__1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Get opponent's hand length
            const opponentHandLength = opponent.hand.cards.length;
            if (opponentHandLength <= 3) {
                throw new __1.GameError(__1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Set discard amount to reach hand size of 3
            const discardAmount = opponentHandLength - 3;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Opponent discards first
            store.prompt(state, new __1.ChooseCardsPrompt(opponent.id, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: discardAmount, max: discardAmount, allowCancel: false }), selected => {
                const cards = selected || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.XerosicsScheme = XerosicsScheme;
