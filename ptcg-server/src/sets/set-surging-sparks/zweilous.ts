import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zweilous extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Deino';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Stomp Off',
      cost: [D],
      damage: 0,
      text: 'Discard the top 2 cards of your opponent\'s deck.'
    },
    {
      name: 'Darkness Fang',
      cost: [D, C, C],
      damage: 60,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '118';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zweilous';
  public fullName: string = 'Zweilous SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 2, sourceCard: this, sourceEffect: this.attacks[0] });
    }

    return state;
  }
}
