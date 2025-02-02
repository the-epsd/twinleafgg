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
    const opponent = game_1.StateUtils.getOpponent(state, player);
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
    const min = Math.min(basicEnergyCards, 2);
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: min, allowCancel: false }), cards => {
        cards = cards || [];
        if (cards.length > 0) {
            player.discard.moveCardsTo(cards, player.hand);
            cards.forEach((card, index) => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });
            if (cards.length > 0) {
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
            }
        }
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
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '171';
        this.name = 'Energy Retrieval';
        this.fullName = 'Energy Retrieval SVI';
        this.text = 'Put 2 basic Energy cards from your discard pile into your hand.';
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
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EnergyRetrieval = EnergyRetrieval;
