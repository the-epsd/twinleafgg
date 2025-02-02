"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcoArm = void 0;
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
    const toolCards = player.discard.cards.filter(c => {
        return c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL;
    }).length;
    if (toolCards === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    const min = Math.min(3, toolCards);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min, max: 3, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        player.discard.moveCardsTo(cards, player.deck);
        cards.forEach((card, index) => {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
        });
        if (cards.length > 0) {
            state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
        }
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class EcoArm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Eco Arm';
        this.fullName = 'Eco Arm AOR';
        this.text = 'Shuffle 3 Pokémon Tool cards from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EcoArm = EcoArm;
