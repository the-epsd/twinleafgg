"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volkner = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Volkner extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Volkner';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.fullName = 'Volkner UPR';
        this.text = 'Search your deck for an Item card and a [L] Energy card, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Volkner = Volkner;
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Count energy and items separately
    let energy = 0;
    let items = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Lightning Energy') {
            energy += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM) {
            items += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Limit max for each type to 1
    const maxEnergies = Math.min(energy, 1);
    const maxItems = Math.min(items, 1);
    // Total max is sum of max for each 
    const count = maxEnergies + maxItems;
    // Pass max counts to prompt options
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ONE_ITEM_AND_ONE_LIGHTNING_ENERGY_TO_HAND, player.deck, {}, { min: 0, max: count, allowCancel: false, blocked, maxEnergies, maxItems }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    cards.forEach((card, index) => {
        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
