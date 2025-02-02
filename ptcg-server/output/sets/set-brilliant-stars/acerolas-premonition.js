"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcerolasPremonition = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const game_1 = require("../../game");
class AcerolasPremonition extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'E';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.name = 'Acerola\'s Premonition';
        this.fullName = 'Acerola\'s Premonition BRS';
        this.text = 'Your opponent reveals their hand, and you draw a card for each Trainer card you find there.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof trainer_card_1.TrainerCard);
            state = store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                const cardsToMove = cardsInOpponentHand.length;
                player.deck.moveTo(player.hand, cardsToMove);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.AcerolasPremonition = AcerolasPremonition;
