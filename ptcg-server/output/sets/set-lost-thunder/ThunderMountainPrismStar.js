"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThunderMountainPrismStar = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ThunderMountainPrismStar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.set = 'LOT';
        this.name = 'Thunder Mountain Prism Star';
        this.fullName = 'Thunder Mountain Prism Star LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '191';
        this.text = 'The attacks of [L] Pokémon (both yours and your opponent\'s) cost[L] less.' +
            'Whenever any player plays an Item or Supporter card from their hand, prevent all effects of that card done to this Stadium card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const index = effect.cost.indexOf(card_types_1.CardType.LIGHTNING);
            // No cost to reduce
            if (index === -1) {
                return state;
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.LIGHTNING)) {
                effect.cost.splice(index, 1);
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof play_card_effects_1.PlaySupporterEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.preventDefault = true;
            return state;
        }
        return state;
    }
}
exports.ThunderMountainPrismStar = ThunderMountainPrismStar;
