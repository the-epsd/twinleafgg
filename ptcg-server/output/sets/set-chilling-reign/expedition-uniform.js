"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpeditionUniform = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length < 3) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const deckBottom = new card_list_1.CardList();
    player.deck.moveTo(deckBottom, 3);
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARDS_ORDER, deckBottom, {}, { min: 3, max: 3, allowCancel: false }), selected => {
        deckBottom.moveCardsTo(selected, player.deck);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class ExpeditionUniform extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.regulationMark = 'E';
        this.name = 'Expedition Uniform';
        this.fullName = 'Expedition Uniform CRE';
        this.text = 'Look at the bottom 3 cards of your deck and put them on top of your deck in any order.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ExpeditionUniform = ExpeditionUniform;
