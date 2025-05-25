import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import {PowerType, State, StoreLike} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {AddSpecialConditionsEffect} from '../../game/store/effects/attack-effects';

export class Hoothoot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Insomnia',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t be Asleep.'
  }];

  public attacks = 
  [{
    name: 'Tackle',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'PRE';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Hoothoot';
  public fullName: string = 'Hoothoot PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(SpecialCondition.ASLEEP)){
      effect.preventDefault = true;
    }

    return state;
  }
}
