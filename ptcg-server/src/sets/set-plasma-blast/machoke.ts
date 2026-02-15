import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Machoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Machop';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Last-Chance Chop',
      cost: [C],
      damage: 20,
      damageCalculation: '+' as const,
      text: 'If this Pok\u00e9mon\'s remaining HP is 10, this attack does 70 more damage.'
    },
    {
      name: 'Seismic Toss',
      cost: [F, F, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Machoke';
  public fullName: string = 'Machoke PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const remainingHp = player.active.hp - player.active.damage;
      if (remainingHp === 10) {
        effect.damage += 70;
      }
    }

    return state;
  }
}
