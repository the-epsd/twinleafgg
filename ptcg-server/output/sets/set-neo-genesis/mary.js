"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mary = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Mary extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Mary';
        this.fullName = 'Mary N1';
        this.text = 'Draw 2 cards. Then, shuffle 2 cards from your hand into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cardsToDraw = Math.min(2, player.deck.cards.length);
            prefabs_1.DRAW_CARDS(player, cardsToDraw);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_SHUFFLE, player.hand, {}, { allowCancel: false, min: 2, max: 2 }), selected => {
                selected.forEach(card => {
                    player.hand.moveCardTo(card, player.deck);
                });
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                });
            });
        }
        return state;
    }
}
exports.Mary = Mary;
