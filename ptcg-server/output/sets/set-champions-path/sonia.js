"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sonia = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        // eslint-disable-next-line no-empty
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            // eslint-disable-next-line no-empty
        }
        else if (c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.BASIC) {
        }
        else {
            blocked.push(index);
        }
    });
    // Pass max counts to prompt options
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND, player.deck, {}, { min: 0, max: 2, allowCancel: false, blocked, allowDifferentSuperTypes: false }), selected => {
        cards = selected || [];
        next();
    });
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
class Sonia extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'D';
        this.set = 'CPA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Sonia';
        this.fullName = 'Sonia CPA';
        this.text = 'Search your deck for up to 2 Basic Pokémon or up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Sonia = Sonia;
