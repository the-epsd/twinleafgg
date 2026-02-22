import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Riolu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Accelerating Stab',
    cost: [F],
    damage: 30,
    text: 'During your next turn, this Pokémon can\'t use Accelerating Stab.'
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Riolu';
  public fullName: string = 'Riolu M1L';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Accelerating Stab')) {
        player.active.cannotUseAttacksNextTurnPending.push('Accelerating Stab');
      }
    }
    return state;
  }
} 