"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempleofSinnoh = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TempleofSinnoh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Temple of Sinnoh';
        this.fullName = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';
    }
    // public reduceEffect(store: StoreLike, state: State, effect: Effect & EnergyCard): State {
    //   if (effect instanceof EnergyCard && StateUtils.getStadiumCard(state) === this) {
    //     (effect as any).energyMap.forEach(({ card, provides }: { card: Card, provides: CardType[] }) => {
    //       if (card.superType === SuperType.ENERGY) {
    //         if (EnergyType.SPECIAL)
    //         provides = [CardType.COLORLESS];
    //         effect.preventDefault = true;
    //         return state;
    //       }
    //     });
    //   }
    //   return state;
    // }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect || effect instanceof play_card_effects_1.AttachEnergyEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const target = effect.target;
            const player = game_1.StateUtils.findOwner(state, target);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, target);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasDarknessEnergy = energyMap.some(energyMap => energyMap.card.energyType === card_types_1.EnergyType.SPECIAL);
            if (hasDarknessEnergy) {
                energyMap.forEach(energyMap => {
                    energyMap.provides = [card_types_1.CardType.COLORLESS];
                    effect.preventDefault = true;
                });
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.TempleofSinnoh = TempleofSinnoh;
