import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Scrafty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scraggy';
  public cardType: CardType = D;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Turf Raid',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'This attack does 20 more damage for each of your remaining Prize cards.'
    },
    {
      name: 'Headbang',
      cost: [D, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '138';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scrafty';
  public fullName: string = 'Scrafty UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Turf Raid
    // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      effect.damage += 20 * player.getPrizeLeft();
    }

    return state;
  }
}
