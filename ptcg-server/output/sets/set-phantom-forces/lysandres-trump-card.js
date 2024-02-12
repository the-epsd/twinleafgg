"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LysandresTrumpCard = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = player.discard.cards.filter(c => c.name !== self.name);
    player.discard.moveCardsTo(cards, player.deck);
    yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        next();
    });
    cards = opponent.discard.cards.filter(c => c.name !== self.name);
    opponent.discard.moveCardsTo(cards, opponent.deck);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
    });
}
class LysandresTrumpCard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PHF';
        this.name = 'Lysandre\'s Trump Card';
        this.fullName = 'Lysandres Trump Card PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.text = 'Each player shuffles all cards in his or her discard pile into his or ' +
            'her deck (except for Lysandre\'s Trump Card).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LysandresTrumpCard = LysandresTrumpCard;
