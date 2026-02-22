import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ursaring extends PokemonCard {

  public regulationMark = 'D';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Teddiursa';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hammer Arm',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Claw Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '139';

  public name: string = 'Ursaring';

  public fullName: string = 'Ursaring DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.deck.cards.length === 0) {
        return state;
      }

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
    }

    return state;
  }
}