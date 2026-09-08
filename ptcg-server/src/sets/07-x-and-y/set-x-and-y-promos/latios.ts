import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Latios extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Supersonic Flight',
    cost: [C, C],
    damage: 40,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }, {
    name: 'Psyburn',
    cost: [P, P, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'TK8O';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Latios';
  public fullName: string = 'Latios TK8O';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Supersonic Flight
    // Ref: set-fusion-strike/pansear.ts (Surprise Attack)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
