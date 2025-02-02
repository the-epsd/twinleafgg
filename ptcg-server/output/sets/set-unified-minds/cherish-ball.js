"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CherishBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    // Can't play this card if no cards in deck
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Can't search for non-Pokemon GX cards
    const searchBlocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof game_1.PokemonCard && !card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
            searchBlocked.push(index);
        }
    });
    // Deck search prompt
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked: searchBlocked }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    // Show opponent our cards
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    // And shuffle our deck
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => { player.deck.applyOrder(order); });
}
class CherishBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UNM';
        this.setNumber = '191';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cherish Ball';
        this.fullName = 'Cherish Ball UNM';
        this.text = 'Search your deck for a Pokemon-GX, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.CherishBall = CherishBall;
