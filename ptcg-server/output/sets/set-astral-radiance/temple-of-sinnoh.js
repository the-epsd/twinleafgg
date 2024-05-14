"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempleofSinnoh = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class TempleofSinnoh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Temple of Sinnoh';
        this.fullName = 'Temple of Sinnoh ASR';
        this.text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';
    }
    reduceEffect(store, state, effect) {
        //   if (effect instanceof AttachEnergyEffect && StateUtils.getStadiumCard(state) === this) {
        //     const target = effect.target;
        //     const player = StateUtils.findOwner(state, target);
        //     const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, target);
        //     store.reduceEffect(state, checkProvidedEnergyEffect);
        //     const energyMap = checkProvidedEnergyEffect.energyMap;
        //     const hasDarknessEnergy = energyMap.some(energyMap => energyMap.card.energyType === EnergyType.SPECIAL);
        //     if (hasDarknessEnergy) {
        //       energyMap.forEach(energyMap => {
        //         energyMap.provides = [CardType.COLORLESS];
        //       });
        //       // effect.preventDefault = true;
        //     }
        //     return state;
        //   }
        //   if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
        //     throw new GameError(GameMessage.CANNOT_USE_STADIUM);
        //   }
        //   return state;
        // }
        if (effect instanceof game_1.EnergyCard && game_1.StateUtils.getStadiumCard(state) === this) {
            effect.energyMap.forEach(({ card, provides }) => {
                if (card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.SPECIAL) {
                    provides = [card_types_1.CardType.COLORLESS];
                    effect.preventDefault;
                    return state;
                }
            });
        }
        return state;
    }
}
exports.TempleofSinnoh = TempleofSinnoh;
