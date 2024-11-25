"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JunkArm = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const itemTypes = [card_types_1.TrainerType.ITEM, card_types_1.TrainerType.TOOL];
    let cards = [];
    cards = player.hand.cards.filter(c => c !== self);
    if (cards.length < 2) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let trainersInDiscard = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof trainer_card_1.TrainerCard && itemTypes.includes(c.trainerType) && c.name !== self.name) {
            trainersInDiscard += 1;
        }
    });
    if (trainersInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // prepare card list without Junk Arm
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
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (!(c instanceof trainer_card_1.TrainerCard)) {
            blocked.push(index);
            return;
        }
        if (!itemTypes.includes(c.trainerType) || c.name === self.name) {
            blocked.push(index);
            return;
        }
    });
    let recovered = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        recovered = selected || [];
        next();
    });
    // Operation canceled by the user
    if (recovered.length === 0) {
        return state;
    }
    player.hand.moveCardTo(self, player.discard);
    player.hand.moveCardsTo(cards, player.discard);
    player.discard.moveCardsTo(recovered, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class JunkArm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TM';
        this.name = 'Junk Arm';
        this.fullName = 'Junk Arm TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.text = 'Discard 2 cards from your hand. Search your discard pile for a Trainer ' +
            'card, show it to your opponent, and put it into your hand. You can\'t ' +
            'choose Junk Arm with the effect of this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.JunkArm = JunkArm;
