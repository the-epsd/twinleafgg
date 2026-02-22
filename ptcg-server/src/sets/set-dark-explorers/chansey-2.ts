import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';

export class Chansey2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Continuous Tumble',
      cost: [C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chansey';
  public fullName: string = 'Chansey DEX 81';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Continuous Tumble - flip until tails, damage = 30 x heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, headsCount => {
        effect.damage = 30 * headsCount;
      });
    }

    return state;
  }
}
