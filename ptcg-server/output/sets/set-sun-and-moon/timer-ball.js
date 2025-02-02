"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerBall = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
class TimerBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SUM';
        this.name = 'Timer Ball';
        this.fullName = 'Timer Ball SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.text = 'Flip 2 coins. For each heads, search your deck for an Evolution Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            let heads = 0;
            store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], results => {
                results.forEach(r => { heads += r ? 1 : 0; });
                if (heads === 0) {
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                }
                let cards = [];
                const blocked = [];
                player.deck.cards.forEach((card, index) => {
                    // eslint-disable-next-line no-empty
                    if (card instanceof pokemon_card_1.PokemonCard && card.stage !== card_types_1.Stage.BASIC && card.stage !== card_types_1.Stage.RESTORED) {
                    }
                    else {
                        blocked.push(index);
                    }
                });
                store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: heads, allowCancel: false, blocked }), selected => {
                    cards = selected || [];
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    if (cards.length > 0) {
                        player.deck.moveCardsTo(cards, player.hand);
                        return store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
                            return state;
                        });
                    }
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            });
        }
        return state;
    }
}
exports.TimerBall = TimerBall;
