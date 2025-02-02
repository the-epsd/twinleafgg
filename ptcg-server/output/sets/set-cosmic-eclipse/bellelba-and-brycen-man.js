"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BellelbaAndBrycenMan = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BellelbaAndBrycenMan extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '186';
        this.name = 'Bellelba & Brycen-Man';
        this.fullName = 'Bellelba & Brycen-Man CEC';
        this.text = 'Discard 3 cards from the top of each player\'s deck.' +
            '' +
            'When you play this card, you may discard 3 other cards from your hand. If you do, each player discards their Benched Pokémon until they have 3 Benched Pokémon. Your opponent discards first.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0 || opponent.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const benchedPokemon = player.bench.filter(b => b.cards.length > 0).length;
            const opponentsBenchedPokemon = opponent.bench.filter(b => b.cards.length > 0).length;
            const cannotDiscardFromHand = (benchedPokemon <= 3 && opponentsBenchedPokemon <= 3) || player.hand.cards.length <= 2;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // discard player cards
            const cardsToDiscard = Math.min(player.deck.cards.length, 3);
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, cardsToDiscard);
            deckTop.cards.forEach((card, index) => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: card.name });
            });
            deckTop.moveTo(player.discard, deckTop.cards.length);
            // discard opponent cards
            const opponentCardsToDiscard = Math.min(opponent.deck.cards.length, 3);
            const opponentDeckTop = new game_1.CardList();
            opponent.deck.moveTo(opponentDeckTop, opponentCardsToDiscard);
            opponentDeckTop.cards.forEach((card, index) => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: card.name });
            });
            opponentDeckTop.moveTo(opponent.discard, opponentDeckTop.cards.length);
            if (cannotDiscardFromHand) {
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_DISCARD_CARDS), wantToUse => {
                if (wantToUse) {
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 3, max: 3 }), cards => {
                        cards = cards || [];
                        player.hand.moveCardsTo(cards, player.discard);
                        cards.forEach((card, index) => {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                        });
                        const oppoonentBenchDifference = opponentsBenchedPokemon - 3;
                        const benchDifference = benchedPokemon - 3;
                        if (oppoonentBenchDifference > 0) {
                            store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], {
                                allowCancel: false,
                                min: oppoonentBenchDifference,
                                max: oppoonentBenchDifference
                            }), (selected) => {
                                selected.forEach(card => {
                                    card.moveTo(opponent.discard);
                                });
                                if (benchDifference > 0) {
                                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], {
                                        allowCancel: false,
                                        min: benchDifference,
                                        max: benchDifference
                                    }), (selected) => {
                                        selected.forEach(card => {
                                            card.moveTo(player.discard);
                                        });
                                        return state;
                                    });
                                }
                                return state;
                            });
                        }
                        else if (benchDifference > 0) {
                            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], {
                                allowCancel: false,
                                min: benchDifference,
                                max: benchDifference
                            }), (selected) => {
                                selected.forEach(card => {
                                    card.moveTo(player.discard);
                                });
                                return state;
                            });
                        }
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return state;
                    });
                }
            });
            return state;
        }
        return state;
    }
}
exports.BellelbaAndBrycenMan = BellelbaAndBrycenMan;
