"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorsResearch = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ProfessorsResearch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '189';
        this.name = 'Professor\'s Research';
        this.fullName = 'Professor\'s Research SVI';
        this.text = 'Discard your hand and draw 7 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Move to supporter pile
            state = store.reduceEffect(state, new game_effects_1.MoveCardsEffect(player.hand, player.supporter, { cards: [effect.trainerCard] }));
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Discard hand
            const cards = player.hand.cards.filter(c => c !== this);
            state = store.reduceEffect(state, new game_effects_1.MoveCardsEffect(player.hand, player.discard, { cards }));
            // Draw 7 cards
            state = store.reduceEffect(state, new game_effects_1.MoveCardsEffect(player.deck, player.hand, { count: 7 }));
            // Discard supporter
            state = store.reduceEffect(state, new game_effects_1.MoveCardsEffect(player.supporter, player.discard, { cards: [effect.trainerCard] }));
        }
        return state;
    }
}
exports.ProfessorsResearch = ProfessorsResearch;
