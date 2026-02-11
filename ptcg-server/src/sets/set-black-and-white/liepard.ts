import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { COPY_BENCH_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Liepard extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Purrloin';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Assist',
      cost: [D],
      damage: 0,
      copycatAttack: true,
      text: 'Choose 1 of your Benched Pokémon\'s attacks and use it as this attack.'
    },
    {
      name: 'Fury Swipes',
      cost: [D, D, C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Liepard';
  public fullName: string = 'Liepard BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COPY_BENCH_ATTACK(store, state, effect as AttackEffect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 40 * heads;
      });
    }

    return state;
  }
}
