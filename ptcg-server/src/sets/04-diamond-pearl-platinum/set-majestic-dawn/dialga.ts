import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Dialga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Time Shift',
    cost: [M],
    damage: 0,
    text: 'Draw cards until you have 6 cards in your hand.'
  },
  {
    name: 'Diamond Blast',
    cost: [M, M, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 60 damage plus 20 more damage.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Dialga';
  public fullName: string = 'Dialga MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Time Shift
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
    }

    // Diamond Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
