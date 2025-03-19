import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';


export class Petilil extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{
    type: CardType.WATER,
    value: -20
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Ram',
    cost: [ CardType.GRASS ],
    damage: 10,
    text: ''
  }, {
    name: 'Absorb',
    cost: [ CardType.GRASS, CardType.COLORLESS ],
    damage: 10,
    text: 'Heal 10 damage from this Pokémon.'
  }];

  public set: string = 'NVI';
  
  public setNumber: string = '23';

  public name: string = 'Petilil';

  public fullName: string = 'Petilil NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect, 10);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    return state;
  }

}
