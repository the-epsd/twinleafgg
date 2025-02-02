"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lass = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Lass extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Lass';
        this.fullName = 'Lass BS';
        this.text = 'You and your opponent show each other your hands, then shuffle all the Trainer cards from your hands into your decks.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.hand.cards.length > 0) {
                return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, player.hand.cards), () => {
                    const playerHandTrainers = player.hand.cards.filter(c => c.superType === card_types_1.SuperType.TRAINER);
                    playerHandTrainers.forEach(cards => {
                        player.hand.moveCardTo(cards, player.deck);
                    });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        if (opponent.hand.cards.length > 0) {
                            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                                const opponentHandTrainers = opponent.hand.cards.filter(c => c.superType === card_types_1.SuperType.TRAINER);
                                opponentHandTrainers.forEach(cards => {
                                    opponent.hand.moveCardTo(cards, opponent.deck);
                                });
                                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                                    opponent.deck.applyOrder(order);
                                    return state;
                                });
                            });
                        }
                        return state;
                    });
                });
            }
            return state;
        }
        return state;
    }
}
exports.Lass = Lass;
