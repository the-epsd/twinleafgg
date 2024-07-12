"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuxuryBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const blocked = player.deck.cards
        .filter(c => c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.POKEMON_LV_X))
        .map(c => player.deck.cards.indexOf(c));
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected;
        next();
    });
    if (cards === null) {
        return state;
    }
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class LuxuryBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.name = 'Luxury Ball';
        this.fullName = 'Luxury Ball SF';
        this.text = 'Search your deck for a Pokemon (excluding Pokemon LV.X), show it to ' +
            'your opponent, and put it into your hand. Shuffle your deck afterward. ' +
            'If any Luxury Ball is in your discard pile, you can\'t play this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.discard.cards.some(c => c.name === this.name)) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LuxuryBall = LuxuryBall;
