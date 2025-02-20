"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarysRequest = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MarysRequest extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Mary\'s Request';
        this.fullName = 'Mary\'s Request UF';
        this.text = 'Draw a card. If you don\'t have any Stage 2 Evolved Pokémon in play, draw 2 more cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.deck.moveTo(player.hand, 1);
            let hasStage2 = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.stage === card_types_1.Stage.STAGE_2) {
                    hasStage2 = true;
                    return;
                }
            });
            if (!hasStage2) {
                player.deck.moveTo(player.hand, Math.min(2, player.deck.cards.length));
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.MarysRequest = MarysRequest;
