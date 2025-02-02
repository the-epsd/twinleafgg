"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoseTower = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class RoseTower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DAA';
        this.name = 'Rose Tower';
        this.fullName = 'Rose Tower DAA';
        this.text = 'Once during each player\'s turn, that player may draw cards until they have 3 cards in their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            if (effect.player.hand.cards.length >= 3 || effect.player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        player.deck.moveTo(player.hand, Math.min(3, player.deck.cards.length) - player.hand.cards.length);
        return state;
    }
}
exports.RoseTower = RoseTower;
