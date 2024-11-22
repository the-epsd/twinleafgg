"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caitlin = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // if (player.deck.cards.length === 0) {
    //   throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    // }
    const max = player.hand.cards.length;
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.hand, {}, { min: 1, max: max, allowCancel: false }), selected => {
        const selectedLength = selected.length;
        const deckTop = new game_1.CardList();
        player.hand.moveCardsTo(selected, deckTop);
        deckTop.moveTo(player.deck);
        player.deck.moveTo(player.hand, selectedLength);
    });
}
class Caitlin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Caitlin';
        this.fullName = 'Caitlin CRE';
        this.text = 'Put as many cards from your hand as you like on the bottom of your deck in any order. Then, draw a card for each card you put on the bottom of your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Caitlin = Caitlin;
