"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergySearchPRO = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, allowCancel: false, differentTypes: true }), selected => {
        cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
    });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class EnergySearchPRO extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'H';
        this.setNumber = '176';
        this.set = 'SSP';
        this.name = 'Energy Search PRO';
        this.fullName = 'Energy Search PRO SSP';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Search your deck for any number of Basic Energy cards of different types, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EnergySearchPRO = EnergySearchPRO;
