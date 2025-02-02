"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerOfWaters = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TowerOfWaters extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'E';
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.name = 'Tower of Waters';
        this.fullName = 'Tower of Waters BST';
        this.text = 'The Retreat Cost of each Rapid Strike Pokémon in play (both yours and your opponent\'s) is [C][C] less.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.RAPID_STRIKE)) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 2);
                }
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.TowerOfWaters = TowerOfWaters;
