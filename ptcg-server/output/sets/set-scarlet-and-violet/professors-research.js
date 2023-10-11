"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorsResearch = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class ProfessorsResearch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SVI';
        this.set2 = 'scarletviolet';
        this.setNumber = '189';
        this.name = 'Professor\'s Research';
        this.fullName = 'Professors Research SVI';
        this.text = 'Discard your hand and draw 7 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 7);
        }
        return state;
    }
}
exports.ProfessorsResearch = ProfessorsResearch;
