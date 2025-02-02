"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roxanne = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const oppPrizes = opponent.getPrizeLeft();
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    if (oppPrizes > 3) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    const cards = player.hand.cards.filter(c => c !== self);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardsTo(cards, player.deck);
    opponent.hand.moveTo(opponent.deck);
    yield store.prompt(state, [
        new shuffle_prompt_1.ShuffleDeckPrompt(player.id),
        new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id)
    ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);
        player.deck.moveTo(player.hand, 6);
        opponent.deck.moveTo(opponent.hand, 2);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class Roxanne extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
        this.regulationMark = 'F';
        this.name = 'Roxanne';
        this.fullName = 'Roxanne ASR';
        this.text = 'You can use this card only if your opponent has 3 or fewer Prize cards remaining.' +
            '' +
            'Each player shuffles their hand into their deck. Then, you draw 6 cards, and your opponent draws 2 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Roxanne = Roxanne;
