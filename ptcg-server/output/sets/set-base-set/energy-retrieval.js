"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyRetrieval = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    // Player has no Basic Energy in the discard pile
    let basicEnergyCards = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            basicEnergyCards++;
        }
    });
    if (basicEnergyCards === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // prepare card list without Junk Arm
    const handTemp = new game_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== effect.trainerCard);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    player.hand.moveCardsTo(cards, player.discard);
    const max = Math.min(basicEnergyCards, 2);
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: max, allowCancel: false }), cards => {
        cards = cards || [];
        if (cards.length > 0) {
            // Recover discarded Pokemon
            player.discard.moveCardsTo(cards, player.hand);
            // Discard item card
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
    });
}
class EnergyRetrieval extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Energy Retrieval';
        this.fullName = 'Energy Retrieval BS';
        this.text = 'Trade 1 of the other cards in your hand for up to 2 basic Energy cards from your discard pile.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EnergyRetrieval = EnergyRetrieval;
