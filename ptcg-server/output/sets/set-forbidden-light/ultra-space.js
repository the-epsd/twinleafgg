"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraSpace = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_2 = require("../../game/store/card/card-types");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const stadiumUsedTurn = player.stadiumUsedTurn;
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
    }
    const blocked = player.deck.cards
        .filter(c => !c.tags.includes(card_types_2.CardTag.ULTRA_BEAST))
        .map(c => player.deck.cards.indexOf(c));
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
        cards = selected;
        next();
    });
    if (cards.length === 0) {
        player.stadiumUsedTurn = stadiumUsedTurn;
        return state;
    }
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class UltraSpace extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'FLI';
        this.setNumber = '115';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ultra Space';
        this.fullName = 'Ultra Space FLI';
        this.text = 'Once during each player\'s turn, that player may search their deck for an Ultra Beast card, reveal it, put it into their hand, and shuffle their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.UltraSpace = UltraSpace;
