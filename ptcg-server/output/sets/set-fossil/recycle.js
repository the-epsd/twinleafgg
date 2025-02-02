"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recycle = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Recycle extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Recycle';
        this.fullName = 'Gambler FO';
        this.text = 'Flip a coin. If heads, put a card in your discard pile on top of your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results) {
                    const deckTop = new game_1.CardList();
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.discard, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        const trainerCards = cards.filter(card => card instanceof game_1.TrainerCard);
                        const nonTrainerCards = cards.filter(card => !(card instanceof game_1.TrainerCard));
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
                }
            });
        }
        return state;
    }
}
exports.Recycle = Recycle;
