"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colress = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
class Colress extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PLS';
        this.name = 'Colress';
        this.fullName = 'Colress PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.text = 'Shuffle your hand into your deck. Then, draw a number of cards equal ' +
            'to the number of Benched Pokemon (both yours and your opponent\'s).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const cards = player.hand.cards.filter(c => c !== this);
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (cards.length === 0 && player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            let benchCount = 0;
            player.bench.forEach(b => benchCount += b.cards.length > 0 ? 1 : 0);
            opponent.bench.forEach(b => benchCount += b.cards.length > 0 ? 1 : 0);
            player.hand.moveCardsTo(cards, player.deck);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
                player.deck.moveTo(player.hand, benchCount);
            });
        }
        return state;
    }
}
exports.Colress = Colress;
