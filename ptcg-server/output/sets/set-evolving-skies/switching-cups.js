"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchingCups = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const __1 = require("../..");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const deckTop = new __1.CardList();
    player.deck.moveTo(deckTop, 1);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach(c => c.cards.moveToTopOfDestination(player.deck));
    deckTop.moveTo(player.hand, 1);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
}
class SwitchingCups extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.name = 'Switching Cups';
        this.fullName = 'Switching Cups EVS';
        this.text = 'Switch a card from your hand with the top card of your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SwitchingCups = SwitchingCups;
