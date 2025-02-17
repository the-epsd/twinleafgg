import {StoreLike,State, EnergyCard, StateUtils} from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import {PutDamageEffect} from '../../game/store/effects/attack-effects';
import {Effect} from '../../game/store/effects/effect';

export class LakeAcuity extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '160';
  public name: string = 'Lake Acuity';
  public fullName: string = 'Lake Acuity LOR';

  public text: string = 'All Pokémon that have any [W] or [F] Energy attached (both yours and your opponent\'s) take 20 less damage from attacks from the opponent\'s Pokémon (after applying Weakness and Resistance).';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this){
      const pokemon = effect.target;

      const waterFightingEnergies = pokemon.cards.filter(card =>
        card instanceof EnergyCard && (card.name === 'Water Energy' || card.name === 'Fighting Energy')
      );

      if (waterFightingEnergies.length > 0){
        effect.damage -= 30;
      }
    }
    
    return state;
  }
}