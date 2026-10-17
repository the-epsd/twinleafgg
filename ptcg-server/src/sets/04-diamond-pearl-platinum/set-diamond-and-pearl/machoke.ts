import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Machoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Machop';
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Karate Chop',
    cost: [F, C],
    damage: 40,
    damageCalculation: '-',
    text: 'Does 40 damage minus 10 damage for each damage counter on Machoke.'
  },
{
    name: 'Seismic Toss',
    cost: [F, F, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Machoke';
  public fullName: string = 'Machoke DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Karate Chop
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const damage = Math.max(40 - player.active.damage, 0);
      effect.damage = damage;
    }

    return state;
  }
}
