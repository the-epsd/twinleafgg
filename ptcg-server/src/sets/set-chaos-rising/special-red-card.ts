import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils, StoreLike, State } from '../../game';
import { GameError, GameMessage } from '../../game';
import { CardList } from '../../game/store/state/card-list';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class SpecialRedCard extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Special Red Card';
  public fullName: string = 'Special Red Card M4';
  public text: string = 'Play this card only if your opponent has 3 or fewer Prize cards remaining. Your opponent shuffles their hand and puts it on the bottom of their deck. If they put any cards on the bottom of their deck in this way, they draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const prizeCount = opponent.prizes.filter(p => p.cards.length > 0).length;
      if (prizeCount > 3) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const cardsInHand = opponent.hand.cards.length;
      if (cardsInHand > 0) {
        const deckBottom = new CardList();
        opponent.hand.moveTo(deckBottom);
        deckBottom.moveTo(opponent.deck);
        DRAW_CARDS(opponent, Math.min(3, opponent.deck.cards.length));
      }
    }
    return state;
  }
}
