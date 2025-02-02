import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Morelull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flickering Spores',
    cost: [C],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  },
  {
    name: 'Ram',
    cost: [Y],
    damage: 10,
    text: ''
  }];

  public set: string = 'UPR';
  public name: string = 'Morelull';
  public fullName: string = 'Morelull UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}