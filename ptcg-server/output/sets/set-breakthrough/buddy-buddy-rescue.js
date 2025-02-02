"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyBuddyRescue = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BuddyBuddyRescue extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Buddy-Buddy Rescue';
        this.fullName = 'Buddy-Buddy Rescue SSH';
        this.text = 'Each player puts a Pokémon from his or her discard pile into his or her hand. (Your opponent chooses first.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonInPlayersDiscard = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                const isPokemon = c instanceof game_1.PokemonCard;
                if (isPokemon) {
                    pokemonInPlayersDiscard += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            let pokemonInOpponentsDiscard = 0;
            const blockedOpponent = [];
            opponent.discard.cards.forEach((c, index) => {
                const isPokemon = c instanceof game_1.PokemonCard;
                if (isPokemon) {
                    pokemonInOpponentsDiscard += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            if (pokemonInOpponentsDiscard === 0 && pokemonInPlayersDiscard === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            if (pokemonInOpponentsDiscard > 0) {
                let cards = [];
                store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                    cards = selected || [];
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: opponent.name, card: card.name });
                    });
                    opponent.discard.moveCardsTo(cards, opponent.hand);
                    opponent.supporter.moveCardTo(effect.trainerCard, opponent.discard);
                });
            }
            if (pokemonInPlayersDiscard > 0) {
                let cards = [];
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked: blockedOpponent }), selected => {
                    cards = selected || [];
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    player.discard.moveCardsTo(cards, player.hand);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                });
            }
            return state;
        }
        return state;
    }
}
exports.BuddyBuddyRescue = BuddyBuddyRescue;
