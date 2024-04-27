"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoseannesBackup = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
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
    const blocked1 = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard) {
            blocked1.push(index);
        }
    });
    const blocked2 = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof trainer_card_1.TrainerCard && card.trainerType !== card_types_1.TrainerType.TOOL) {
            blocked2.push(index);
        }
    });
    const blocked3 = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof trainer_card_1.TrainerCard && card.trainerType !== card_types_1.TrainerType.STADIUM) {
            blocked3.push(index);
        }
    });
    const blocked4 = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof game_1.EnergyCard) {
            blocked4.push(index);
        }
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked: blocked1 }), selected => {
        cards = selected || [];
        next();
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 0, max: 1, allowCancel: false, blocked: blocked2 }), selected => {
        cards = selected || [];
        next();
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.STADIUM }, { min: 0, max: 1, allowCancel: false, blocked: blocked3 }), selected => {
        cards = selected || [];
        next();
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false, blocked: blocked4 }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    player.supporterTurn = 1;
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class RoseannesBackup extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Roseanne\'s Backup';
        this.fullName = 'Roseanne\'s Backup BRS';
        this.text = 'Choose 1 or more:' +
            '' +
            '• Shuffle a Pokémon from your discard pile into your deck.' +
            '• Shuffle a Pokémon Tool card from your discard pile into your deck.' +
            '• Shuffle a Stadium card from your discard pile into your deck.' +
            '• Shuffle an Energy card from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.RoseannesBackup = RoseannesBackup;
