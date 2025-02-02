"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyclingRoad = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class CyclingRoad extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Cycling Road';
        this.fullName = 'Cycling Road MEW';
        this.text = 'Once during each player\'s turn, that player may discard a Basic Energy card from their hand in order to draw a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        const hasEnergyInHand = player.hand.cards.some(c => {
            return c instanceof game_1.EnergyCard;
        });
        if (!hasEnergyInHand) {
            throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
        }
        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1 }), cards => {
            cards = cards || [];
            if (cards.length === 0) {
                return;
            }
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 1);
        });
        return state;
    }
}
exports.CyclingRoad = CyclingRoad;
