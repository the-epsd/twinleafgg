"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrnOfVitality = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const NoSingleStrikeEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL && c.name === 'Single Strike Energy';
    });
    if (!NoSingleStrikeEnergyInDiscard) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL, name: 'Single Strike Energy' }, { min: 1, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        player.discard.moveCardsTo(cards, player.deck);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class UrnOfVitality extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Urn of Vitality';
        this.fullName = 'Urn of Vitality BST';
        this.text = 'Shuffle up to 2 Single Strike Energy cards from your discard pile into' +
            'your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.UrnOfVitality = UrnOfVitality;
