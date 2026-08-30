import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

// FLI Rockruff 75 (https://limitlesstcg.com/cards/FLI/75)
export class Rockruff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [F, C],
    damage: 50,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'FLI';
  public setNumber = '75';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Rockruff';
  public fullName: string = 'Rockruff FLI';

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