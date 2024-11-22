"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapturingAroma = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class CapturingAroma extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '153';
        this.regulationMark = 'F';
        this.name = 'Capturing Aroma';
        this.fullName = 'Capturing Aroma SIT';
        this.text = 'Flip a coin. If heads, search your deck for an Evolution Pokémon, reveal it, and put it into your hand. If tails, search your deck for a Basic Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.stage == card_types_1.Stage.BASIC) {
                    blocked.push(index);
                }
            });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    let cards = [];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
                        cards = selectedCards || [];
                        // Operation canceled by the user
                        if (cards.length === 0) {
                            player.supporter.moveCardTo(this, player.discard);
                            return state;
                        }
                        cards.forEach((card, index) => {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
                        if (cards.length > 0) {
                            player.supporter.moveCardTo(this, player.discard);
                            state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                        }
                        cards.forEach(card => {
                            player.deck.moveCardTo(card, player.hand);
                        });
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
                if (!flipResult) {
                    let cards = [];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false }), selectedCards => {
                        cards = selectedCards || [];
                        // Operation canceled by the user
                        if (cards.length === 0) {
                            player.supporter.moveCardTo(this, player.discard);
                            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                            });
                        }
                        cards.forEach((card, index) => {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
                        if (cards.length > 0) {
                            player.supporter.moveCardTo(this, player.discard);
                            state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                        }
                        cards.forEach(card => {
                            player.deck.moveCardTo(card, player.hand);
                        });
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.CapturingAroma = CapturingAroma;
