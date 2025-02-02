"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drasna = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const cards = player.hand.cards.filter(c => c !== self);
    // Put hand in deck (except for Drasna, which will be discarded by default)
    if (cards.length > 0) {
        player.hand.moveCardsTo(cards, player.deck);
    }
    // Shuffle deck
    yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        next();
    });
    // Flip coin and draw cards based on the result.
    yield store.prompt(state, [
        new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
    ], result => {
        player.deck.moveTo(player.hand, result ? 8 : 3);
        next();
    });
    return state;
}
class Drasna extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SSP';
        this.setNumber = '173';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Drasna';
        this.fullName = 'Drasna SSP';
        this.text = 'Shuffle your hand into your deck. Then, flip a coin. If heads, draw 8 cards. If tails, draw 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Drasna = Drasna;
