"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostCity = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const __1 = require("../..");
class LostCity extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '161';
        this.name = 'Lost City';
        this.fullName = 'Lost City LOR';
        this.text = 'Whenever a Pokémon (either yours or your opponent\'s) is Knocked Out, put that Pokémon in the Lost Zone instead of the discard pile. (Discard all attached cards.)';
    }
    reduceEffect(_store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            if (effect instanceof game_effects_1.KnockOutEffect) {
                const knockedOutPokemonCard = effect.target.getPokemonCard();
                const cardList = state_utils_1.StateUtils.findCardList(state, this);
                const owner = state_utils_1.StateUtils.findOwner(state, cardList);
                if (knockedOutPokemonCard) {
                    if (knockedOutPokemonCard instanceof __1.PokemonCardList) {
                        knockedOutPokemonCard.cards.forEach(card => {
                            cardList.moveCardTo(card, owner.lostzone);
                        });
                        return state;
                    }
                    return state;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.LostCity = LostCity;
