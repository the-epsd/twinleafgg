"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostBlender = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LostBlender extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '181';
        this.name = 'Lost Blender';
        this.fullName = 'Lost Blender LOR';
        this.text = 'Put 2 cards from your hand in the Lost Zone. If you do, draw a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.hand.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            cards = player.hand.cards;
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 2, max: 2, allowCancel: false }), selected => {
                cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                player.hand.moveCardsTo(cards, player.lostzone);
                player.deck.moveTo(player.hand, 1);
                player.supporter.moveCardTo(this, player.discard);
                store.log(state, game_1.GameLog.LOG_PLAYER_DRAWS_CARD, { name: player.name });
            });
        }
        return state;
    }
}
exports.LostBlender = LostBlender;
