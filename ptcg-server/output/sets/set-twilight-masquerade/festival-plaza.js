"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FestivalGrounds = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class FestivalGrounds extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'TWM';
        this.name = 'Festival Grounds';
        this.fullName = 'Festival Grounds TWM';
        this.text = 'Pokémon with any Energy attached cannot be affected by Special Conditions, and they recover from any Special Conditions.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            state.players.forEach(player => {
                if (player.active.specialConditions.length === 0) {
                    return;
                }
                // const opponent = StateUtils.getOpponent(state, player);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
                    store.reduceEffect(state, checkProvidedEnergyEffect);
                    const energyMap = checkProvidedEnergyEffect.energyMap;
                    const hasEnergy = state_utils_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.COLORLESS || card_types_1.CardType.DARK || card_types_1.CardType.DRAGON || card_types_1.CardType.FAIRY || card_types_1.CardType.GRASS || card_types_1.CardType.METAL || card_types_1.CardType.PSYCHIC || card_types_1.CardType.WATER || card_types_1.CardType.LIGHTNING || card_types_1.CardType.FIRE]);
                    if (hasEnergy) {
                        const conditions = cardList.specialConditions.slice();
                        conditions.forEach(condition => {
                            cardList.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                            cardList.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
                            cardList.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
                            cardList.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
                            cardList.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                        });
                    }
                });
                // opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
                //   const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
                //   store.reduceEffect(state, checkProvidedEnergyEffect);
                //   const energyMap = checkProvidedEnergyEffect.energyMap;
                //   const hasEnergy = StateUtils.checkEnoughEnergy(energyMap, [ CardType.GRASS ]);
                //   if (hasEnergy) {
                //     const conditions = cardList.specialConditions.slice();
                //     conditions.forEach(condition => {
                //       cardList.removeSpecialCondition(condition);
                //     });
                //   }
                // });
                if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
                }
            });
            return state;
        }
        return state;
    }
}
exports.FestivalGrounds = FestivalGrounds;
