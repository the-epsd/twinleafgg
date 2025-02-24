"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensAdvice = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class StevensAdvice extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Steven\'s Advice';
        this.fullName = 'Steven\'s Advice PK';
        this.text = 'Draw a number of cards up to the number of your opponent\'s Pokémon in play. If you have more than 7 cards(including this one) in your hand, you can\'t play this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerHand = player.hand.cards.filter(c => c !== this);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (playerHand.length + 1 >= 7) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalOpponentPokemon = opponentBenched + 1;
            player.deck.moveTo(player.hand, Math.min(totalOpponentPokemon, player.deck.cards.length));
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.StevensAdvice = StevensAdvice;
