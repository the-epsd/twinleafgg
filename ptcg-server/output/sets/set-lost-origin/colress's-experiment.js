"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColresssExperiment = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class ColresssExperiment extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'LOR';
        this.set2 = 'lostorigin';
        this.setNumber = '155';
        this.name = 'Colress\'s Experiment';
        this.fullName = 'Colress\'s Experiment LOR';
        this.text = 'Look at the top 5 cards of your deck and put 3 of them into your hand. Put the other cards in the Lost Zone.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 3, max: 3, allowCancel: true }), selected => {
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.lostzone);
                return state;
            });
        }
        return state;
    }
}
exports.ColresssExperiment = ColresssExperiment;
