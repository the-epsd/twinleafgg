"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peonia = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Peonia extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.name = 'Peonia';
        this.fullName = 'Peonia CRE';
        this.text = 'Put up to 3 Prize cards into your hand. Then, for each Prize card you put into your hand in this way, put a card from your hand face down as a Prize card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // we'll discard peonia later
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            return store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_message_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 3, allowCancel: false }), chosenPrizes => {
                chosenPrizes = chosenPrizes || [];
                const hand = player.hand;
                chosenPrizes.forEach(prize => prize.moveTo(hand, 1));
                store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARDS_TO_RETURN_TO_PRIZES, player.hand, {}, { min: chosenPrizes.length, max: chosenPrizes.length, allowCancel: false }), cards => {
                    cards = cards || [];
                    const newPrizeCards = new game_1.CardList();
                    player.hand.moveCardsTo(cards, newPrizeCards);
                    return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARDS_ORDER, newPrizeCards, { allowCancel: false }), (rearrangedCards) => {
                        newPrizeCards.applyOrder(rearrangedCards);
                        // put rearranged cards into prize first prize slots available
                        player.prizes.forEach(p => {
                            if (p.cards.length === 0) {
                                p.cards = newPrizeCards.cards.splice(0, 1);
                            }
                            p.isSecret = true;
                        });
                        return state;
                    });
                });
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                player.supporterTurn = 1;
            });
        }
        return state;
    }
}
exports.Peonia = Peonia;
