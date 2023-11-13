import { Power, State, StoreLike } from '../../..';
import { Effect } from '../effects/effect';
import { PowerEffect } from '../effects/game-effects';
import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';


export abstract class TrainerCard extends Card {

  public superType: SuperType = SuperType.TRAINER;

  public trainerType: TrainerType = TrainerType.ITEM;

  public format: Format = Format.NONE;

  public text: string = '';

  public powers: Power[] = [];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect){
      for (let i = 0; i < this.powers.length; i++){
        if (effect.power === this.powers[i] && effect.power.effect !== undefined){
          return effect.power.effect(store, state, effect);
        }
        return state;
      }
      return state;
    }
    return state;
  }
}