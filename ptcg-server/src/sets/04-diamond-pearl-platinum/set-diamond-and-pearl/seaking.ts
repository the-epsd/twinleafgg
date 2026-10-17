import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Seaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Goldeen';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flail',
    cost: [C, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of damage counters on Seaking.'
  },
{
    name: 'Horn Drill',
    cost: [W, W],
    damage: 50,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Seaking';
  public fullName: string = 'Seaking DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = effect.player.active.damage;
    }

    return state;
  }
}
