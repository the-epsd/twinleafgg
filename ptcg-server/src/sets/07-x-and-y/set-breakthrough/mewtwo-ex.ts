import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MewtwoEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 170;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Photon Wave',
    cost: [C, C],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 30 (before applying Weakness and Resistance).'
  },
  {
    name: 'Psyburn',
    cost: [P, P, C, C],
    damage: 120,
    text: ''
  }];

  public set: string = 'BKT';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mewtwo-EX';
  public fullName: string = 'Mewtwo-EX BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Photon Wave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 30);
    }

    return state;
  }
}
