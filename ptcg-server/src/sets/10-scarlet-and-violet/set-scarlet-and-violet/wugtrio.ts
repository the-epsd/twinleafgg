import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Wugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wiglett';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Headbutt',
    cost: [W],
    damage: 30,
    text: ''
  }, {
    name: 'Undersea Tunnel',
    cost: [C, C, C],
    damage: 0,
    text: 'Flip 3 coins. For each heads, discard the top 3 cards of your opponent\'s deck.'
  }];

  public set: string = 'SVI';
  public name: string = 'Wugtrio';
  public fullName: string = 'Wugtrio SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 3 * heads, sourceCard: this, sourceEffect: this.attacks[1] });
      });
    }

    return state;
  }

}