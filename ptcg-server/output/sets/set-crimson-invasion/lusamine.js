"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lusamine = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const supportersAndStadiumsInDiscard = player.discard.cards.filter(c => c instanceof trainer_card_1.TrainerCard && (c.trainerType === card_types_1.TrainerType.STADIUM || c.trainerType === card_types_1.TrainerType.SUPPORTER)).length;
    if (supportersAndStadiumsInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof trainer_card_1.TrainerCard && (c.trainerType === card_types_1.TrainerType.STADIUM || c.trainerType === card_types_1.TrainerType.SUPPORTER)) {
            /**/
        }
        else {
            blocked.push(index);
        }
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: Math.min(2, supportersAndStadiumsInDiscard), max: Math.min(2, supportersAndStadiumsInDiscard), allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    player.discard.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return state;
}
class Lusamine extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CIN';
        this.name = 'Lusamine';
        this.fullName = 'Lusamine CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.text = 'Put 2 in any combination of Supporter and Stadium cards from your discard pile into your hand.';
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
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Lusamine = Lusamine;
