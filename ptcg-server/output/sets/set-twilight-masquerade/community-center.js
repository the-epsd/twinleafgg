"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityCenter = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class CommunityCenter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.name = 'Community Center';
        this.fullName = 'Community Center TWM';
        this.text = 'Once during each player\'s turn, if that player has already played a Supporter from their hand, they may heal 10 damage from each of their Pokémon';
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        // Check if player has 6 Pokemon in play
        if (player.active.cards.length + player.bench.length !== 6) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (player.supporterTurn !== 0) {
            // Heal each Pokemon by 10 damage
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
            });
            return state;
        }
        return state;
    }
}
exports.CommunityCenter = CommunityCenter;
