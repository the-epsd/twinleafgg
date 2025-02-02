"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copycat = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const cards = player.hand.cards.filter(c => c !== self);
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    if (cards.length > 0) {
        player.hand.moveCardsTo(cards, player.deck);
    }
    yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        next();
    });
    const cardsNumber = opponent.hand.cards.length;
    player.deck.moveTo(player.hand, cardsNumber);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class Copycat extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.name = 'Copycat';
        this.fullName = 'Copycat EVS';
        this.text = 'Shuffle your hand into your deck. Then, draw a card for each card in ' +
            'your opponent\'s hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Copycat = Copycat;
