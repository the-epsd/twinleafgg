import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Vanillish extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Vanillite';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Surefire Spin',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'Flip 2 coins. If both of them are heads, this attack does 40 more damage.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vanillish';
  public fullName: string = 'Vanillish PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Surefire Spin - flip 2 coins, +40 if both heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const allHeads = results.every(r => r);
        if (allHeads) {
          effect.damage += 40;
        }
      });
    }

    return state;
  }
}
