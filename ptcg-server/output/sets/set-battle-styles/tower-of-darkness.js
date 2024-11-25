"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerOfDarkness = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TowerOfDarkness extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'E';
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Tower of Darkness';
        this.fullName = 'Tower of Darkness BST';
        this.text = 'Once during each playe\'s turn, that player may draw 2 cards. In order to use this effect, that player must discard a Single Strike card from their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.Card && c.tags.includes(card_types_1.CardTag.SINGLE_STRIKE);
            });
            if (!hasEnergyInHand) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.hand.cards.forEach((c, index) => {
                if (c instanceof game_1.Card && c.tags.includes(card_types_1.CardTag.SINGLE_STRIKE)) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 1, max: 1, blocked: blocked }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 2);
            });
            return state;
        }
        return state;
    }
}
exports.TowerOfDarkness = TowerOfDarkness;
