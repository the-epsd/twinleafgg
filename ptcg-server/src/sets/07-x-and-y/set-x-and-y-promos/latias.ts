import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Latias extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Psychic Sphere',
    cost: [P],
    damage: 20,
    text: ''
  }, {
    name: 'Psychic Prism',
    cost: [P, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'TK8a';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Latias';
  public fullName: string = 'Latias TK8a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic Prism
    // Ref: set-furious-fists/torchic.ts (Quick Attack)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
