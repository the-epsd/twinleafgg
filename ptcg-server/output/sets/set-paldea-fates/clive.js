"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clive = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class Clive extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.set = 'PAF';
        this.name = 'Clive';
        this.fullName = 'Clive PAF';
        this.text = 'Your opponent reveals their hand. Draw 2 cards for each Supporter card you find there.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER);
            state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                const cardsToMove = cardsInOpponentHand.length * 2;
                player.deck.moveTo(player.hand, cardsToMove);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.Clive = Clive;
