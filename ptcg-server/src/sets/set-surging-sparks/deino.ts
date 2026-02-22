import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Deino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Stomp Off',
      cost: [D],
      damage: 0,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Bite',
      cost: [D, C],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '117';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Deino';
  public fullName: string = 'Deino SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
    }

    return state;
  }
}
