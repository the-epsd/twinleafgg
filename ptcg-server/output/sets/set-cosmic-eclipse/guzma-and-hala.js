"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuzmaAndHala = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GuzmaAndHala extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '193';
        this.regulationMark = 'F';
        this.name = 'Guzma & Hala';
        this.fullName = 'Guzma & Hala CEC';
        this.text = 'Search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.' +
            '' +
            'When you play this card, you may discard 2 other cards from your hand. If you do, you may also search for a Pokémon Tool card and a Special Energy card in this way.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let maxTools = 0;
            let maxSpecialEnergies = 0;
            if (player.hand.cards.length < 2) {
                player.supporterTurn = 1;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_DISCARD_CARDS), wantToUse => {
                if (wantToUse) {
                    maxTools = 1;
                    maxSpecialEnergies = 1;
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 2, max: 2 }), cards => {
                        cards = cards || [];
                        player.hand.moveCardsTo(cards, player.discard);
                        cards.forEach((card, index) => {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                        });
                    });
                }
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.hand, {}, { allowCancel: false, min: 0, max: 3, maxSpecialEnergies, maxTools, maxStadiums: 1 }), cards => {
                    cards = cards || [];
                    player.hand.moveCardsTo(cards, player.hand);
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                });
                player.supporter.moveCardTo(this, player.discard);
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                player.supporterTurn = 1;
            });
        }
        return state;
    }
}
exports.GuzmaAndHala = GuzmaAndHala;
