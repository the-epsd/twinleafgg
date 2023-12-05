"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimordialAltar = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
class PrimordialAltar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'F';
        this.set = 'SIT';
        this.set2 = 'silvertempest';
        this.setNumber = '161';
        this.name = 'Primordial Altar';
        this.fullName = 'Primordial Altar SIT';
        this.text = 'Once during each player\'s turn, that player may look at the top card of their deck. They may discard that card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && __1.StateUtils.getStadiumCard(state) === this) {
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        if (player.deck.cards.length === 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        const deckTop = new card_list_1.CardList();
        player.deck.moveTo(deckTop, 1);
        return store.prompt(state, new __1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop.cards // Fix error by changing toArray() to cards
        ), () => {
            return store.prompt(state, new __1.ConfirmPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND), yes => {
                if (yes) {
                    // Add card to hand
                    deckTop.moveCardsTo(deckTop.cards, player.hand);
                }
                else {
                    // Discard card
                    deckTop.moveTo(player.deck);
                }
                return state;
            });
        });
    }
}
exports.PrimordialAltar = PrimordialAltar;
