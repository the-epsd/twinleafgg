import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Shellder extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Shell Rest',
    cost: [C],
    damage: 0,
    text: 'Remove 2 damage counters from Shellder.'
  },
  {
    name: 'Tongue Slap',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Shellder';
  public fullName: string = 'Shellder SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shell Rest
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
