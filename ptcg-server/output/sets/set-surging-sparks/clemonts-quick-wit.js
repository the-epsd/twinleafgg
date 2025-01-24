"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClemontsQuickWit = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ClemontsQuickWit extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SSP';
        this.setNumber = '167';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Clemont\'s Quick Wit';
        this.fullName = 'Clemont\'s Quick Wit SSP';
        this.text = 'Heal 60 damage from each of your L Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Populate targets; Lightning Pokemon with damage counters
            const targets = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.cardType == card_types_1.CardType.LIGHTNING && cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            // Can't play this card if there's no valid targets
            if (targets.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            targets.forEach(target => {
                // Heal all our targets
                const healEffect = new game_effects_1.HealEffect(player, target, 60);
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.ClemontsQuickWit = ClemontsQuickWit;
