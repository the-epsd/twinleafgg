"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsReceiver = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    player.hand.moveCardTo(effect.trainerCard, player.discard);
    effect.preventDefault = true;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Create a blocked array for non-Team Rocket Supporter cards
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (!(card instanceof trainer_card_1.TrainerCard) ||
            card.trainerType !== card_types_1.TrainerType.SUPPORTER ||
            !card.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
            blocked.push(index);
        }
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    cards.forEach((card) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class TeamRocketsReceiver extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Team Rocket\'s Receiver';
        this.fullName = 'Team Rocket\'s Receiver SV10';
        this.text = 'Search your deck for 1 Supporter with "Team Rocket" in its name, reveal it, and put it into your hand. Then shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TeamRocketsReceiver = TeamRocketsReceiver;
