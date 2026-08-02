import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Piplup extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Charm',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 20 (before applying Weakness and Resistance).'
  },
  {
    name: 'Peck',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LTR';
  public setNumber: string = 'RC6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Piplup';
  public fullName: string = 'Piplup LTR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Charm
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    return state;
  }
}
