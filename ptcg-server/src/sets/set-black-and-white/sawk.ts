import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Sawk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Low Kick',
      cost: [F],
      damage: 30,
      text: ''
    },
    {
      name: 'Double Kick',
      cost: [F, C, C],
      damage: 50,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Sawk';
  public fullName: string = 'Sawk BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 50 * heads;
      });
    }
    return state;
  }
}
