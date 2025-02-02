"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delinquent = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Delinquent extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BKP';
        this.name = 'Delinquent';
        this.fullName = 'Delinquent BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.text = 'Discard any Stadium card in play. If you do, your opponent discards 3 cards from his or her hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // const opponentCards = opponent.hand.cards;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
            if (stadiumCard == undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(this, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (stadiumCard !== undefined) {
                // Discard Stadium
                const cardList = state_utils_1.StateUtils.findCardList(state, stadiumCard);
                const player = state_utils_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
            }
            // Discard 3 cards from opponent's hand
            const opponentCards = opponent.hand.cards.filter(c => c !== this);
            if (opponentCards.length <= 3) {
                opponent.hand.moveTo(opponent.discard);
            }
            if (opponentCards.length > 3) {
                let cards = [];
                state = store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: 3, max: 3, allowCancel: false }), selected => {
                    cards = selected || [];
                    opponent.hand.moveCardsTo(cards, opponent.discard);
                });
            }
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.Delinquent = Delinquent;
