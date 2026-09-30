import { State, StoreLike } from '../../../game';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_OPPONENT_ACTIVE_AND_BENCH_ATTACK } from '../../../game/store/prefabs/copy-attack-prefabs';

export class Thievul extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nickit';
  public cardType: CardType[] = [D];
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Skill Thief',
      cost: [C, C],
      damage: 0,
      copycatAttack: true,
      text: "If you have no cards in your hand, choose an attack from 1 of your opponent's Pokémon in play and use it as this attack.",
    },
    {
      name: 'Sharp Fang',
      cost: [D, C, C],
      damage: 80,
      text: '',
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '54';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Thievul';
  public fullName: string = 'Thievul M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length > 0) {
        return state;
      }

      return COPY_OPPONENT_ACTIVE_AND_BENCH_ATTACK(store, state, effect as AttackEffect);
    }
    return state;
  }
}
