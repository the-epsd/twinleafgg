"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hapu = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Hapu extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNM';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '200';
        this.name = 'Hapu';
        this.fullName = 'Hapu UNM';
        this.text = 'Look at the top 6 cards of your deck and put 2 of them into your hand. Discard the other cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 6);
            const min = Math.min(2, deckTop.cards.length);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min, max: 2, allowCancel: false }), selected => {
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.discard);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.Hapu = Hapu;
