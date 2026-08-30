import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Suicune extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Spiral Drain',
    cost: [W, C],
    damage: 20,
    text: 'Heal 20 damage from this Pokémon.'
  },
  {
    name: 'Aurora Beam',
    cost: [W, W, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'TK9S';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Suicune';
  public fullName: string = 'Suicune TK9S';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spiral Drain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
