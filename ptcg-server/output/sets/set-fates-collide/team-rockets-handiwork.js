"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsHandiwork = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TeamRocketsHandiwork extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Team Rocket\'s Handiwork';
        this.fullName = 'Team Rocket\'s Handiwork FCO';
        this.text = 'Flip 2 coins. For each heads, discard 2 cards from the top of your opponent\'s deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(effect.player.id, game_message_1.GameMessage.COIN_FLIP)
            ], (result) => {
                const heads = result.filter(r => !!r).length;
                opponent.deck.moveTo(opponent.discard, heads * 2);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.TeamRocketsHandiwork = TeamRocketsHandiwork;
