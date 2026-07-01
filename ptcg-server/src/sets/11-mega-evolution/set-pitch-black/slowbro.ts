import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Slowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slowpoke';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'All Out',
    cost: [P],
    damage: 50,
    damageCalculation: '+',
    text: 'If you have no cards in your hand, this attack does 160 more damage.',
  },
  {
    name: 'Zen Headbutt',
    cost: [C, C, C],
    damage: 110,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '29';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slowbro';
  public fullName: string = 'Slowbro M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length === 0) {
        effect.damage += 160;
      }
    }
    return state;
  }
}
