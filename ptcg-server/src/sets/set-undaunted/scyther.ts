import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Cut',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Slashing Strike',
    cost: [G, C, C],
    damage: 50,
    text: 'During your next turn, Scyther can\'t use Slashing Strike.'
  }];

  public set: string = 'UD';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther UD';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slashing Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
      }
    }
    return state;
  }
}