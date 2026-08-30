import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Kricketot';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Screech',
      cost: [C],
      damage: 0,
      text: 'During your next turn, any damage done to the Defending Pokémon by attacks is increased by 60 (after applying Weakness and Resistance).'
    },
    {
      name: 'Slash',
      cost: [G],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'BKP';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kricketune';
  public fullName: string = 'Kricketune BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 60);
    }

    return state;
  }
}
