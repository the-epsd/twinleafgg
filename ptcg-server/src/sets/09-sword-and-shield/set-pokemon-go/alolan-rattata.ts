import { PokemonCard, Stage, CardType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class AlolanRattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 40;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Hyper Fang',
    cost: [C, C],
    damage: 50,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public regulationMark = 'F';

  public set: string = 'PGO';
  public name: string = 'Alolan Rattata';
  public fullName: string = 'Alolan Rattata PGO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}
