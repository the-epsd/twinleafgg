"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scott = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scott extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.cardImage = 'assets/cardback.png';
        this.set = 'EM';
        this.setNumber = '84';
        this.name = 'Scott';
        this.fullName = 'Scott EM';
        this.text = 'Search your deck for up to 3 cards in any combination of Supporter cards and Stadium cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(this, player.supporter);
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                const isSupporter = c instanceof game_1.TrainerCard && (c.trainerType === game_1.TrainerType.SUPPORTER);
                const isStadium = c instanceof game_1.TrainerCard && (c.trainerType === game_1.TrainerType.STADIUM);
                if (!(isSupporter || isStadium)) {
                    blocked.push(index);
                }
            });
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.deck, {}, { min: 0, max: 3, allowCancel: false, blocked }), cards => {
                if (!cards || cards.length === 0) {
                    return state;
                }
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                cards.forEach(card => prefabs_1.MOVE_CARD_TO(state, card, player.hand));
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.Scott = Scott;
