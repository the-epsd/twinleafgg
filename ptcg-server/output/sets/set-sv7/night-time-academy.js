"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NightTimeAcademy = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class NightTimeAcademy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SV6a';
        this.name = 'Academy at Night';
        this.fullName = 'Academy at Night SV6a';
        this.text = 'Once during each player\'s turn, that player may put a card from their hand on top of their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0 || player.hand.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const deckTop = new game_1.CardList();
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.hand.moveCardsTo(cards, deckTop);
                }
                deckTop.moveToTopOfDestination(player.deck);
            });
        }
        return state;
    }
}
exports.NightTimeAcademy = NightTimeAcademy;
