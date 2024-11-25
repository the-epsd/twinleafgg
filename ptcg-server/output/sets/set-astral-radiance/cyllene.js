"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cyllene = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class Cyllene extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'ASR';
        this.setNumber = '138';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cyllene';
        this.fullName = 'Cyllene ASR';
        this.text = 'Flip 2 coins. Put a number of cards up to the number of heads from your discard pile on top of your deck in any order.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let heads = 0;
            store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                results.forEach(r => { heads += r ? 1 : 0; });
                if (heads === 0) {
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                }
                const deckTop = new game_1.CardList();
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.discard, {}, { min: Math.min(heads, player.discard.cards.length), max: heads, allowCancel: false }), selected => {
                    cards = selected || [];
                    const trainerCards = cards.filter(card => card instanceof trainer_card_1.TrainerCard);
                    const nonTrainerCards = cards.filter(card => !(card instanceof trainer_card_1.TrainerCard));
                    let canMoveTrainerCards = true;
                    if (trainerCards.length > 0) {
                        const discardEffect = new play_card_effects_1.TrainerToDeckEffect(player, this);
                        store.reduceEffect(state, discardEffect);
                        canMoveTrainerCards = !discardEffect.preventDefault;
                    }
                    const cardsToMove = canMoveTrainerCards ? cards : nonTrainerCards;
                    if (cardsToMove.length > 0) {
                        cardsToMove.forEach(card => {
                            player.discard.moveCardTo(card, deckTop);
                        });
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            deckTop.applyOrder(order);
                            deckTop.moveToTopOfDestination(player.deck);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                            if (cardsToMove.length > 0) {
                                return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cardsToMove), () => state);
                            }
                            return state;
                        });
                    }
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Cyllene = Cyllene;
