import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Joltik extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [L],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public regulationMark = 'I';

  public set: string = 'WHT';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik SV11W';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}
