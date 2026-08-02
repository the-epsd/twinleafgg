import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Teddiursa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Teary Eyes',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, any damage done to Teddiursa by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'UF';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Teddiursa';
  public fullName: string = 'Teddiursa UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 20);
    }

    return state;
  }
}
