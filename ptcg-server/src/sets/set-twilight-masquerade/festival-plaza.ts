import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PlayerType } from '../../game';

export class FestivalGrounds extends TrainerCard {

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '149';
    
  public  trainerType = TrainerType.STADIUM;
  
  public set = 'TWM';
  
  public name = 'Festival Grounds';
  
  public fullName = 'Festival Grounds TWM';
    
  public  text = 'Pokémon with any Energy attached cannot be affected by Special Conditions, and they recover from any Special Conditions.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      state.players.forEach(player => {
        if (player.active.specialConditions.length === 0) {
          return;
        }

        // const opponent = StateUtils.getOpponent(state, player);
    
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    
          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
          store.reduceEffect(state, checkProvidedEnergyEffect);
    
          const energyMap = checkProvidedEnergyEffect.energyMap;
          const hasEnergy = StateUtils.checkEnoughEnergy(energyMap, [ CardType.COLORLESS || CardType.DARK || CardType.DRAGON || CardType.FAIRY || CardType.GRASS || CardType.METAL || CardType.PSYCHIC || CardType.WATER || CardType.LIGHTNING || CardType.FIRE ]);
    
          if (hasEnergy) {
            const conditions = cardList.specialConditions.slice();
            conditions.forEach(condition => {
              cardList.removeSpecialCondition(SpecialCondition.ASLEEP);
              cardList.removeSpecialCondition(SpecialCondition.POISONED);
              cardList.removeSpecialCondition(SpecialCondition.PARALYZED);
              cardList.removeSpecialCondition(SpecialCondition.BURNED);
              cardList.removeSpecialCondition(SpecialCondition.CONFUSED);
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


        if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
          throw new GameError(GameMessage.CANNOT_USE_STADIUM);
        }
      });
      return state;
    }
    return state;
  }
}