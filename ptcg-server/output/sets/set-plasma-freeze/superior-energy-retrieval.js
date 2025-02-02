"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperiorEnergyRetrieval = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const energy_card_1 = require("../../game/store/card/energy-card");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    cards = player.hand.cards.filter(c => c !== self);
    if (cards.length < 2) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let basicEnergies = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            basicEnergies += 1;
        }
    });
    if (basicEnergies === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // prepare card list without Self
    const handTemp = new card_list_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 2, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    let recovered = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 4, allowCancel: true }), selected => {
        recovered = selected || [];
        next();
    });
    // Operation canceled by the user
    if (recovered.length === 0) {
        return state;
    }
    player.hand.moveCardsTo(cards, player.discard);
    player.discard.moveCardsTo(recovered, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class SuperiorEnergyRetrieval extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PLF';
        this.name = 'Superior Energy Retrieval';
        this.fullName = 'Superior Energy Retrieval PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.text = 'You can use this card only if you discard 2 other cards from ' +
            'your hand.' +
            '' +
            'Put up to 4 Basic Energy cards from your discard pile into ' +
            'your hand. (You can\'t choose a card you discarded with the ' +
            'effect of this card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            // If not prevented, proceed with the original effect
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SuperiorEnergyRetrieval = SuperiorEnergyRetrieval;
