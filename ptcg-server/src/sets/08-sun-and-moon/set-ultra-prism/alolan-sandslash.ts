import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class AlolanSandslash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Alolan Sandshrew';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Spike Armor',
    cost: [],
    damage: 30,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if this Pokémon is Knocked Out), put 6 damage counters on the Attacking Pokémon.'
  },
  {
    name: 'Frost Breath',
    cost: [W, C, C],
    damage: 90,
    text: ''
  }];

  public set: string = 'UPR';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Sandslash';
  public fullName: string = 'Alolan Sandslash UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 60 });
    }

    return state;
  }
}
