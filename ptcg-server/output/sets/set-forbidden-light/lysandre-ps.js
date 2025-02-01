"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LysandrePS = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LysandrePS extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Lysandre Prism Star';
        this.fullName = 'Lysandre Prism Star FLI';
        this.text = 'For each of your [R] Pokémon in play, put a card from your opponent\'s discard pile in the Lost Zone.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.discard.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let firesInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const pokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, pokemonType);
                if (pokemonType.cardTypes.includes(R)) {
                    firesInPlay++;
                }
            });
            if (!firesInPlay) {
                player.supporter.moveCardTo(this, player.lostzone);
                return state;
            }
            let cards = [];
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.discard, {}, { min: Math.min(opponent.discard.cards.length, firesInPlay), max: Math.min(opponent.discard.cards.length, firesInPlay), allowCancel: false }), selected => {
                cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                opponent.discard.moveCardsTo(cards, opponent.lostzone);
                player.supporter.moveCardTo(this, player.lostzone);
                store.log(state, game_1.GameLog.LOG_PLAYER_DRAWS_CARD, { name: player.name });
            });
        }
        return state;
    }
}
exports.LysandrePS = LysandrePS;
