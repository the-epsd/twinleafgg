"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensResolve = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 3, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
    return store.reduceEffect(state, endTurnEffect);
}
class StevensResolve extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CES';
        this.setNumber = '145';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steven\'s Resolve';
        this.fullName = 'Steven\'s Resolve CES';
        this.text = 'Search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck. Your turn ends.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.StevensResolve = StevensResolve;
