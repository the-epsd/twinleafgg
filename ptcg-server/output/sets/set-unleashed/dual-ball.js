"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let heads = 0;
    yield store.prompt(state, [
        new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
        new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
    ], results => {
        results.forEach(r => { heads += r ? 1 : 0; });
        next();
    });
    if (heads === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { allowCancel: true, min: 0, max: heads }), results => {
        cards = results || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class DualBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UL';
        this.name = 'Dual Ball';
        this.fullName = 'Dual Ball UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokemon ' +
            'card, show it to your opponent, and put it into your hand. Shuffle your ' +
            'deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.DualBall = DualBall;
