"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volo = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Volo extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'Volo';
        this.fullName = 'Volo LOR';
        this.text = 'Discard 1 of your Benched Pokémon V and all attached cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const players = state.players;
            const player = players[0];
            const bench = player.bench;
            if (bench.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (bench.length > 0) {
                const pokemonToDiscard = bench[0];
                if (!pokemonToDiscard.cards[0].tags.includes(game_1.CardTag.POKEMON_V)) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                if (pokemonToDiscard.cards[0].tags.includes(game_1.CardTag.POKEMON_V)) {
                    const supporterTurn = player.supporterTurn;
                    if (supporterTurn > 0) {
                        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
                    }
                    player.hand.moveCardTo(effect.trainerCard, player.supporter);
                    // We will discard this card after prompt confirmation
                    effect.preventDefault = true;
                    const cardsToDiscard = pokemonToDiscard.cards;
                    pokemonToDiscard.moveCardsTo(cardsToDiscard, player.discard);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            }
        }
        return state;
    }
}
exports.Volo = Volo;
