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
        this.set2 = 'shinytreasuresex';
        this.setNumber = '175';
        this.set = 'SV4';
        this.name = 'Clive';
        this.fullName = 'Clive SV4';
        this.text = 'Your opponent reveals their hand. Draw 2 cards for each Supporter card you find there.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER);
            state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                const cardsToMove = opponent.hand.cards.slice(0, cardsInOpponentHand.length * 2);
                player.deck.moveCardsTo(cardsToMove, player.hand);
            });
        }
        return state;
    }
}
exports.Clive = Clive;
