"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shauna = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const cards = player.hand.cards.filter(c => c !== self);
    if (cards.length > 0) {
        player.hand.moveCardsTo(cards, player.deck);
        yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            next();
        });
    }
    player.deck.moveTo(player.hand, 5);
    return state;
}
class Shauna extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'XY';
        this.name = 'Shauna';
        this.fullName = 'Shauna XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.text = 'Shuffle your hand into your deck. Then, draw 5 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Shauna = Shauna;
