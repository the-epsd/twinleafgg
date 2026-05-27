import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Aegislash extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Doublade';
  public cardType: CardType = M;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Slash',
    cost: [C, C, C],
    damage: 80,
    text: ''
  },
  {
    name: 'Metal Slash',
    cost: [M, C, C, C],
    damage: 230,
    text: 'During your next turn, this Pokémon can\'t use attacks.'
  }];

  public regulationMark = 'J';
  public set: string = 'POR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Aegislash';
  public fullName: string = 'Aegislash POR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Slash - can't attack next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
