import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';

export class Dragonair extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Dratini';
  public cardType: CardType[] = [C];
  public hp: number = 70;
  public retreat = [C, C];

  public attacks = [{
    name: 'Spiral Wave',
    cost: [L, W],
    damage: 20,
    damageCalculationn: 'x',
    text: 'Flip a coin until you get tails. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'EX';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dragonair';
  public fullName: string = 'Dragonair EX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
      effect.damage = 20 * heads;
    });
    }
    return state;
  }
}