import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Grovyle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Treecko';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [C, C],
      damage: 20,
      text: ''
    },
    {
      name: 'Agility',
      cost: [P, C, C],
      damage: 30,
      text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Grovyle during your opponent\'s next turn.'
    }
  ];

  public set: string = 'CG';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grovyle';
  public fullName: string = 'Grovyle CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }
    return state;
  }
}
