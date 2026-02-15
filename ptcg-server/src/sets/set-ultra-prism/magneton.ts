import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Ram',
      cost: [M],
      damage: 20,
      text: ''
    },
    {
      name: 'Zap Cannon',
      cost: [M, M, C],
      damage: 80,
      text: 'This Pokémon can\'t use Zap Cannon during your next turn.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '82';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 2: Zap Cannon
    // Ref: AGENTS-patterns.md (can't use attack next turn)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Zap Cannon');
    }

    return state;
  }
}
