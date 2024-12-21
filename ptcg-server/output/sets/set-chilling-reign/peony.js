"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peony = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Peony extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
        this.name = 'Peony';
        this.fullName = 'Peony CRE';
        this.text = 'Discard your hand and search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                    cards.forEach((card, index) => {
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Peony = Peony;
