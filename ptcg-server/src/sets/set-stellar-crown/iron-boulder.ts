import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronBoulder extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Adjusted Horn',
    cost: [P, C],
    damage: 170,
    text: 'If you don\'t have the same number of cards in your hand as your opponent, this attack does nothing.'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Iron Boulder';
  public fullName: string = 'Iron Boulder SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.hand.cards.length !== opponent.hand.cards.length) {
        effect.damage = 0;
      }
    }

    return state;
  }

}
