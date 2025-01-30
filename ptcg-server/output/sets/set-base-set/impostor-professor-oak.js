"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpostorProfessorOak = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class ImpostorProfessorOak extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.name = 'Impostor Professor Oak';
        this.fullName = 'Impostor Professor Oak BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.text = 'Your opponent shuffles his or her hand into his or her deck, then draws 7 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Shuffle opponent's hand into their deck
            opponent.hand.moveCardsTo(opponent.hand.cards, opponent.deck);
            store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
            // Draw 7 cards for the opponent
            opponent.deck.moveTo(opponent.hand, 7);
            // Discard the played Trainer card
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.ImpostorProfessorOak = ImpostorProfessorOak;
