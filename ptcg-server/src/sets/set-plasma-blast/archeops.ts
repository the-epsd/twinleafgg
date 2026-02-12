import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Archeops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Archen';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [];

  public attacks = [
    {
      name: 'Acrobatics',
      cost: [F],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
    },
    {
      name: 'Swift Dive',
      cost: [F, F],
      damage: 100,
      text: 'If this Pok\u00e9mon\'s remaining HP is 50 or less, this attack\'s base damage is 50.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Archeops';
  public fullName: string = 'Archeops PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage += 20 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const remainingHp = player.active.hp - player.active.damage;
      if (remainingHp <= 50) {
        effect.damage = 50;
      }
    }

    return state;
  }
}
