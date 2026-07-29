import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/prefabs';

export class Turtonator extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 130;
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Shell Trap',
    cost: [R, F],
    damage: 30,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if it is Knocked Out), put 8 damage counters on the Attacking Pokémon.'
  },
  {
    name: 'Heat Crash',
    cost: [C, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '198';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Turtonator';
  public fullName: string = 'Turtonator FST 198';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 80 });
    }

    return state;
  }
}
