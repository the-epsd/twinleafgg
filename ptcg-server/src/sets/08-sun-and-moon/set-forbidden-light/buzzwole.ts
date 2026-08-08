import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

// FCI Buzzwole 77 (https://limitlesstcg.com/cards/FLI/77)
export class Buzzwole extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ULTRA_BEAST];
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sledgehammer', cost: [F], damage: 30, text: 'If your opponent has exactly 4 Prize cards remaining, this attack does 90 more damage.'
  }, {
    name: 'Swing Around', cost: [F, F, C], damage: 80, text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
  }];

  public set: string = 'FLI';
  public name: string = 'Buzzwole';
  public fullName: string = 'Buzzwole FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.getPrizeLeft() === 4) {
        effect.damage += 90;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 20 * heads;
      });
    }

    return state;
  }

}