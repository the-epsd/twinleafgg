import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Haxorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Fraxure';
  public cardType: CardType = C;
  public hp: number = 140;
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dual Chop',
      cost: [C, C],
      damage: 50,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
    },
    {
      name: 'Giga Impact',
      cost: [C, C, C],
      damage: 120,
      text: 'This Pokemon can\'t attack during your next turn.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haxorus';
  public fullName: string = 'Haxorus NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dual Chop - flip 2 coins, 50x heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        effect.damage = 50 * heads;
      });
    }

    // Giga Impact - can't attack next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Giga Impact')) {
        player.active.cannotUseAttacksNextTurnPending.push('Giga Impact');
      }
    }

    return state;
  }
}
