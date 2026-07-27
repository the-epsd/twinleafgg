import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Axew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [];
  public retreat = [C];

  public attacks = [{
    name: 'Dragon Rage',
    cost: [C, C],
    damage: 50,
    text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
  }];

  public set: string = 'BWP';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Axew';
  public fullName: string = 'Axew BWP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.includes(false)) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
