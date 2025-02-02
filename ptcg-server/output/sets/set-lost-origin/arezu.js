"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arezu = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    cards = player.hand.cards.filter(c => c !== self);
    if (cards.length < 1) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.RADIANT) || card.tags.includes(card_types_1.CardTag.POKEMON_V) || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
            blocked.push(index);
        }
        if (card instanceof game_1.PokemonCard && card.stage == card_types_1.Stage.BASIC) {
            blocked.push(index);
        }
    });
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        // if (cards[0].tags.includes(CardTag.POKEMON_ex) ||
        //   cards[0].tags.includes(CardTag.POKEMON_GX) ||
        //   cards[0].tags.includes(CardTag.POKEMON_EX)) {
        //   throw new GameError(GameMessage.INVALID_TARGET);
        // }
        // else {
        player.deck.moveCardsTo(cards, player.hand);
        player.hand.moveCardTo(self, player.discard);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Arezu extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '153';
        this.name = 'Arezu';
        this.fullName = 'Arezu LOR';
        this.text = 'Search your deck for up to 3 Evolution Pokémon that don\'t have a Rule Box, reveal them, and put them into your hand. Then, shuffle your deck. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Arezu = Arezu;
