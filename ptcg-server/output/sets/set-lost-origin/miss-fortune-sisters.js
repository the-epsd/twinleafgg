"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissFortuneSisters = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class MissFortuneSisters extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '164';
        this.name = 'Miss Fortune Sisters';
        this.fullName = 'Miss Fortune Sisters LOR';
        this.text = 'Look at the top 5 cards of your opponent\'s deck and discard any number of Item cards you find there. Your opponent shuffles the other cards back into their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const deckTop = new game_1.CardList();
            opponent.deck.moveTo(deckTop, 5);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, deckTop, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 5, allowCancel: false }), selected => {
                deckTop.moveCardsTo(selected, opponent.discard);
                deckTop.moveTo(opponent.deck);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
                return state;
            });
        }
        return state;
    }
}
exports.MissFortuneSisters = MissFortuneSisters;
