"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretBox = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const handCards = player.hand.cards.filter(c => c !== effect.trainerCard);
    if (handCards.length < 3) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Count tools and items separately
    let tools = 0;
    let items = 0;
    let stadiums = 0;
    let supporters = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL) {
            tools += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM) {
            items += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM) {
            stadiums += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER) {
            supporters += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Limit max for each type to 1
    const maxTools = Math.min(tools, 1);
    const maxItems = Math.min(items, 1);
    const maxStadiums = Math.min(stadiums, 1);
    const maxSupporters = Math.min(supporters, 1);
    // Total max is sum of max for each 
    const count = maxTools + maxItems + maxStadiums + maxSupporters;
    // prepare card list without Junk Arm
    const handTemp = new game_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 3, max: 3, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardsTo(cards, player.discard);
    // Pass max counts to prompt options
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: count, allowCancel: false, blocked, maxTools, maxItems, maxStadiums, maxSupporters }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length === 0) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    player.deck.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class SecretBox extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '163';
        this.name = 'Secret Box';
        this.fullName = 'Secret Box TWM';
        this.text = 'You can use this card only if you discard 3 other cards from your hand.' +
            '' +
            'Search your deck for an Item card, a Pokémon Tool card, a Supporter card, and a Stadium card, reveal them, and put them into your hand.Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SecretBox = SecretBox;
