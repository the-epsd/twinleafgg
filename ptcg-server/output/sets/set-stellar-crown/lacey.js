"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lacey = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const cards = player.hand.cards.filter(c => c !== self);
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    effect.preventDefault = true;
    if (cards.length > 0) {
        player.hand.moveCardsTo(cards, player.deck);
        yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            next();
        });
    }
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const cardsToDraw = opponent.getPrizeLeft() > 3 ? 4 : 8;
    player.deck.moveTo(player.hand, cardsToDraw);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class Lacey extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.regulationMark = 'H';
        this.name = 'Lacey';
        this.fullName = 'Lacey SCR';
        this.text = 'Shuffle your hand into your deck. Then, draw 4 cards. If your opponent has 3 or fewer Prize cards remaining, draw 8 cards instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Lacey = Lacey;
