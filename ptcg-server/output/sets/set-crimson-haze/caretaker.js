"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caretaker = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Caretaker extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Caretaker';
        this.fullName = 'Caretaker SV5a';
        this.text = 'Draw 2 cards. Then, if Community Center is in play, shuffle this Caretaker back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.deck.moveTo(player.hand, 2);
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined && stadiumCard.name === 'Community Center') {
                player.supporter.moveTo(player.deck);
            }
            else {
                player.supporter.moveTo(player.discard);
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            
            return state;
        }
        return state;
    }
}
exports.Caretaker = Caretaker;
