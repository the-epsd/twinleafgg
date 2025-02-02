"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilentLab = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const game_1 = require("../../game");
class SilentLab extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PRC';
        this.name = 'Silent Lab';
        this.fullName = 'Silent Lab PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.text = 'Each Basic Pokemon in play, in each player\'s hand, ' +
            'and in each player\'s discard pile has no Abilities.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const pokemonCard = effect.card;
            const cardList = state_utils_1.StateUtils.findCardList(state, pokemonCard);
            const isBasic = cardList instanceof pokemon_card_list_1.PokemonCardList
                ? cardList.isBasic()
                : pokemonCard.stage === card_types_1.Stage.BASIC;
            if (!effect.power.exemptFromAbilityLock) {
                if (isBasic && pokemonCard.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
                }
                return state;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.SilentLab = SilentLab;
