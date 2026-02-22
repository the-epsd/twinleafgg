import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronBoulder extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 140;
  public weakness = [{ type: CardType.DARK }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Adjusted Horn',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
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
