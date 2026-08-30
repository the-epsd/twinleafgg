import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Unfezant extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Tranquill';
  public cardType: CardType[] = [C];
  public hp: number = 150;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Daunt',
    cost: [C, C],
    damage: 50,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 50 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Air Slash',
    cost: [C, C, C],
    damage: 150,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public setNumber: string = '145';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Unfezant';
  public fullName: string = 'Unfezant RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Daunt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 50);
    }

    // Air Slash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
