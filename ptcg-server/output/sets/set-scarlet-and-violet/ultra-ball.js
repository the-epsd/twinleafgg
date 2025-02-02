"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    if (player.hand.cards.filter(c => c !== self).length < 2 || player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    effect.preventDefault = true;
    const handTemp = new card_list_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 2, max: 2, allowCancel: false }), selected => {
        if (selected) {
            player.hand.moveCardsTo(selected, player.discard);
        }
        next();
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), selected => {
        if (selected && selected.length > 0) {
            player.deck.moveCardsTo(selected, player.hand);
            store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: selected[0].name });
            store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => next());
        }
        else {
            next();
        }
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class UltraBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '196';
        this.name = 'Ultra Ball';
        this.fullName = 'Ultra Ball SVI';
        this.text = 'Discard 2 cards from your hand. (If you can\'t discard 2 cards, you ' +
            'can\'t play this card.) Search your deck for a Pokemon, reveal it, and ' +
            'put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.UltraBall = UltraBall;
