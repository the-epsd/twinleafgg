"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasHospitality = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const cards = player.hand.cards.filter(c => c !== effect.trainerCard);
    if (cards.length > 4) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
    const cardsToDraw = opponentBenched + 1;
    player.deck.moveTo(player.hand, cardsToDraw);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class ErikasHospitality extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'HIF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Erika\'s Hospitality';
        this.fullName = 'Erika\'s Hospitality HIF';
        this.text = 'You can play this card only if you have 4 or fewer other cards in your hand.' +
            '' +
            'Draw a card for each of your opponent\'s Pokémon in play.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ErikasHospitality = ErikasHospitality;
