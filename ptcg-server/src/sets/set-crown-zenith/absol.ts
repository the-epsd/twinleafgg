import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { GameLog } from '../../game';
import { AFTER_ATTACK, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Absol extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.DARK;

  public hp: number = 100;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.DARK],
      damage: 30,
      text: ''
    },
    {
      name: 'Lost Claw',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'Put a random card from your opponent\'s hand in the Lost Zone.'
    }
  ];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '76';

  public name: string = 'Absol';

  public fullName: string = 'Absol CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        MOVE_CARDS(store, state, opponent.hand, opponent.lostzone, { cards: [randomCard], sourceCard: this, sourceEffect: this.attacks[1] });

        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE, {
          player: opponent.name,
          card: randomCard.name
        });
      }
    }
    return state;

  }
}