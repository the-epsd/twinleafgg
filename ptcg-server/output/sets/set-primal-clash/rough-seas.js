"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoughSeas = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class RoughSeas extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PRC';
        this.name = 'Rough Seas';
        this.fullName = 'Rough Seas PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.text = 'Once during each player\'s turn, that player may heal 30 damage ' +
            'from each of his or her W Pokemon and L Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const targets = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if ([card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING].includes(card.cardType) && cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            if (targets.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            targets.forEach(target => {
                // Heal Pokemon
                const healEffect = new game_effects_1.HealEffect(player, target, 30);
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.RoughSeas = RoughSeas;
