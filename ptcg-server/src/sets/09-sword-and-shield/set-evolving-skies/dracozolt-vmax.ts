import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class DracozoltVmax extends PokemonCard {
  protected _tags = [CardTag.POKEMON_VMAX];
  public stage: Stage = Stage.VMAX;
  public evolvesFrom: string = 'Dracozolt V';
  public cardType: CardType[] = [L];
  public hp: number = 330;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Spark Trap',
    cost: [L],
    damage: 60,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if it is Knocked Out), put 12 damage counters on the Attacking Pokémon.'
  },
  {
    name: 'Max Impact',
    cost: [L, C, C, C],
    damage: 200,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '59';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dracozolt VMAX';
  public fullName: string = 'Dracozolt VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 120 });
    }

    return state;
  }
}
