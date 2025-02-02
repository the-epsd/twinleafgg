import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GameLog } from '../../game';

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        opponent.hand.moveCardTo(randomCard, opponent.lostzone);

        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE, {
          player: opponent.name,
          card: randomCard.name
        });
      }
    }
    return state;

  }
}