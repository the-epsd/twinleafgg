"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let coinResult = false;
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coinResult = result;
        next();
    });
    if (coinResult) {
        let cards = [];
        yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), (selected) => {
            cards = selected || [];
            next();
        });
        if (cards.length > 0) {
            player.discard.moveCardsTo(cards, player.deck);
            cards.forEach((card, index) => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });
            if (cards.length > 0) {
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
            }
        }
        player.deck.moveCardsTo(cards, player.hand);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), (order) => {
        player.deck.applyOrder(order);
    });
}
class PokeBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'G';
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Poké Ball';
        this.fullName = 'Poké Ball JU';
        this.text = 'Flip a coin. If heads, you may search your deck for any Basic Pokémon or Evolution card. Show that card to your opponent, then put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokeBall = PokeBall;
